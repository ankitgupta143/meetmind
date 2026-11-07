import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";

/**
 * Escapes regex special characters to prevent ReDoS / injection
 */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Format timestamp in seconds to MM:SS
 */
function formatSeconds(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return null;
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Perform multi-entity search across the user's workspace
 */
export async function searchWorkspace({
  userId,
  query = "",
  filter = "all",
  limit = 50,
}) {
  if (!userId) {
    const error = new Error("User ID is required.");
    error.code = "USER_ID_REQUIRED";
    throw error;
  }

  const trimmedQuery = typeof query === "string" ? query.trim() : "";
  if (!trimmedQuery) {
    return {
      results: [],
      total: 0,
      query: "",
      filter,
    };
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const safeRegex = new RegExp(escapeRegex(trimmedQuery), "i");
  const maxLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);

  // 1. Fetch all user non-deleted meetings to establish scope & ownership
  const userMeetings = await Meeting.find({
    ownerId: userObjectId,
    status: { $ne: "deleted" },
  })
    .select(
      "_id title description meetingDate participants processingStatus durationSeconds createdAt"
    )
    .sort({ meetingDate: -1, createdAt: -1 })
    .lean();

  if (userMeetings.length === 0) {
    return {
      results: [],
      total: 0,
      query: trimmedQuery,
      filter,
    };
  }

  const meetingMap = new Map(
    userMeetings.map((m) => [String(m._id), m])
  );
  const userMeetingIds = userMeetings.map((m) => m._id);

  const results = [];
  const activeFilter = filter.toLowerCase();

  // ------------------------------------------------------------------
  // A. Search Meetings (Titles, Descriptions, Participants)
  // ------------------------------------------------------------------
  if (activeFilter === "all" || activeFilter === "meeting") {
    for (const meeting of userMeetings) {
      const titleMatch = safeRegex.test(meeting.title || "");
      const descMatch = safeRegex.test(meeting.description || "");

      if (titleMatch || descMatch) {
        results.push({
          id: `meeting-${meeting._id}`,
          meetingId: String(meeting._id),
          type: "meeting",
          icon: "meeting",
          title: meeting.title || "Untitled Meeting",
          description:
            meeting.description ||
            `Meeting recorded on ${new Date(
              meeting.meetingDate || meeting.createdAt
            ).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`,
          meetingTitle: meeting.title,
          targetUrl: `/meetings/${meeting._id}`,
          date: meeting.meetingDate || meeting.createdAt,
          metadata: {
            participantsCount: meeting.participants?.length || 0,
            status: meeting.processingStatus,
          },
          score: titleMatch ? 10 : 5,
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // B. Search Transcripts (Segments & Speaker lines)
  // ------------------------------------------------------------------
  if (activeFilter === "all" || activeFilter === "transcript") {
    const transcripts = await Transcript.find({
      meetingId: { $in: userMeetingIds },
      status: "completed",
    })
      .select("meetingId segments rawText")
      .lean();

    for (const transcript of transcripts) {
      const meetingIdStr = String(transcript.meetingId);
      const meeting = meetingMap.get(meetingIdStr);
      if (!meeting) continue;

      const segments = Array.isArray(transcript.segments)
        ? transcript.segments
        : [];

      let matchCount = 0;
      for (const seg of segments) {
        if (!seg.text) continue;

        if (safeRegex.test(seg.text)) {
          const timestampStr = formatSeconds(seg.startTime);
          const timeQueryParam =
            typeof seg.startTime === "number"
              ? `?time=${Math.floor(seg.startTime)}`
              : "";

          results.push({
            id: `transcript-${transcript._id}-${seg.startTime || matchCount}`,
            meetingId: meetingIdStr,
            type: "transcript",
            icon: "transcript",
            title: meeting.title || "Meeting Transcript",
            description: seg.text.length > 220 ? `${seg.text.slice(0, 220)}...` : seg.text,
            meetingTitle: meeting.title,
            targetUrl: `/meetings/${meetingIdStr}${timeQueryParam}`,
            startTime: seg.startTime,
            speaker: seg.speaker || null,
            metadata: {
              speaker: seg.speaker || "Speaker",
              timestamp: timestampStr,
            },
            score: 7,
          });

          matchCount++;
          // Cap segment matches per transcript to prevent one meeting from dominating
          if (matchCount >= 4) break;
        }
      }

      // Fallback: If segments didn't match or were empty, check rawText
      if (matchCount === 0 && transcript.rawText && safeRegex.test(transcript.rawText)) {
        const matchIndex = transcript.rawText.search(safeRegex);
        const snippetStart = Math.max(0, matchIndex - 40);
        const snippetEnd = Math.min(
          transcript.rawText.length,
          matchIndex + 160
        );
        const snippet = `${snippetStart > 0 ? "..." : ""}${transcript.rawText
          .slice(snippetStart, snippetEnd)
          .trim()}${snippetEnd < transcript.rawText.length ? "..." : ""}`;

        results.push({
          id: `transcript-${transcript._id}-raw`,
          meetingId: meetingIdStr,
          type: "transcript",
          icon: "transcript",
          title: meeting.title || "Meeting Transcript",
          description: snippet,
          meetingTitle: meeting.title,
          targetUrl: `/meetings/${meetingIdStr}`,
          metadata: {
            speaker: null,
            timestamp: null,
          },
          score: 4,
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // C. Search Action Items & Decisions (MeetingInsights)
  // ------------------------------------------------------------------
  if (
    activeFilter === "all" ||
    activeFilter === "action" ||
    activeFilter === "decision"
  ) {
    const insightsList = await MeetingInsights.find({
      meetingId: { $in: userMeetingIds },
      status: "completed",
    })
      .select("meetingId actionItems decisions summary")
      .lean();

    for (const insights of insightsList) {
      const meetingIdStr = String(insights.meetingId);
      const meeting = meetingMap.get(meetingIdStr);
      if (!meeting) continue;

      // Action Items
      if (activeFilter === "all" || activeFilter === "action") {
        const actionItems = Array.isArray(insights.actionItems)
          ? insights.actionItems
          : [];

        actionItems.forEach((item, index) => {
          const titleMatch = safeRegex.test(item.title || "");
          const descMatch = safeRegex.test(item.description || "");
          const assigneeMatch = safeRegex.test(item.assignee || "");

          if (titleMatch || descMatch || assigneeMatch) {
            results.push({
              id: `action-${insights._id}-${index}`,
              meetingId: meetingIdStr,
              type: "action",
              icon: "action",
              title: item.title,
              description:
                item.description ||
                (item.assignee
                  ? `Assigned to: ${item.assignee} • Priority: ${item.priority || "medium"}`
                  : `Status: ${item.status || "pending"} • In "${meeting.title}"`),
              meetingTitle: meeting.title,
              targetUrl: `/meetings/${meetingIdStr}?tab=action-items`,
              metadata: {
                assignee: item.assignee,
                status: item.status,
                priority: item.priority,
                dueDate: item.dueDate,
              },
              score: titleMatch ? 9 : 6,
            });
          }
        });
      }

      // Decisions
      if (activeFilter === "all" || activeFilter === "decision") {
        const decisions = Array.isArray(insights.decisions)
          ? insights.decisions
          : [];

        decisions.forEach((dec, index) => {
          const titleMatch = safeRegex.test(dec.title || "");
          const descMatch = safeRegex.test(dec.description || "");

          if (titleMatch || descMatch) {
            results.push({
              id: `decision-${insights._id}-${index}`,
              meetingId: meetingIdStr,
              type: "decision",
              icon: "decision",
              title: dec.title,
              description:
                dec.description ||
                `Strategic decision captured from "${meeting.title}"`,
              meetingTitle: meeting.title,
              targetUrl: `/meetings/${meetingIdStr}?tab=decisions`,
              metadata: {
                owner: dec.owner,
              },
              score: titleMatch ? 9 : 6,
            });
          }
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // D. Search Speakers (Participants & Transcript Speakers)
  // ------------------------------------------------------------------
  if (activeFilter === "all" || activeFilter === "speaker") {
    const seenSpeakers = new Set();

    // From meeting participants
    for (const meeting of userMeetings) {
      if (Array.isArray(meeting.participants)) {
        for (const p of meeting.participants) {
          const name = (p.name || "").trim();
          const email = (p.email || "").trim();
          if (!name && !email) continue;

          if (safeRegex.test(name) || safeRegex.test(email)) {
            const key = `${name.toLowerCase()}#${email.toLowerCase()}`;
            if (!seenSpeakers.has(key)) {
              seenSpeakers.add(key);
              results.push({
                id: `speaker-${meeting._id}-${name || email}`,
                meetingId: String(meeting._id),
                type: "speaker",
                icon: "speaker",
                title: name || email,
                description: `Participant in "${meeting.title}"${email && name ? ` (${email})` : ""}`,
                meetingTitle: meeting.title,
                targetUrl: `/meetings/${meeting._id}`,
                metadata: {
                  name,
                  email,
                },
                score: 8,
              });
            }
          }
        }
      }
    }
  }

  // Sort results by relevance score, then recent
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  const trimmedResults = results.slice(0, maxLimit).map((item) => {
    // Remove internal score before returning to client
    const { score, ...cleanItem } = item;
    return cleanItem;
  });

  return {
    results: trimmedResults,
    total: trimmedResults.length,
    query: trimmedQuery,
    filter: activeFilter,
  };
}
