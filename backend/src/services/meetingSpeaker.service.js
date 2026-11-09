import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";
import { calculateSpeakerStats } from "../utils/calculateSpeakerStats.js";

/**
 * Rename speakers across Transcript, MeetingInsights, and Meeting participants
 */
export async function updateMeetingSpeakers({ meetingId, userId, speakerMapping = {} }) {
  if (!meetingId || !userId) {
    const error = new Error("Meeting ID and User ID are required.");
    error.code = "PARAMS_REQUIRED";
    throw error;
  }

  // Sanitize mapping: normalize keys and values
  const cleanMapping = {};
  for (const [key, val] of Object.entries(speakerMapping || {})) {
    if (typeof key === "string" && typeof val === "string") {
      const oldName = key.trim();
      const newName = val.trim();
      if (oldName && newName && oldName !== newName) {
        cleanMapping[oldName] = newName;
      }
    }
  }

  if (Object.keys(cleanMapping).length === 0) {
    return {
      success: true,
      updatedSegmentsCount: 0,
      message: "No changes to speaker names were requested.",
    };
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    const error = new Error("Meeting not found or access denied.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  let updatedSegmentsCount = 0;
  let newSpeakerStats = [];
  let distinctSpeakers = [];

  // 1. Update Transcript segments
  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
  });

  if (transcript && Array.isArray(transcript.segments)) {
    transcript.segments.forEach((seg) => {
      if (seg.speaker && cleanMapping[seg.speaker]) {
        seg.speaker = cleanMapping[seg.speaker];
        updatedSegmentsCount++;
      }
    });

    // Recalculate speaker stats using updated segments
    newSpeakerStats = calculateSpeakerStats(transcript.segments);
    distinctSpeakers = Array.from(
      new Set(transcript.segments.map((s) => s.speaker).filter(Boolean))
    );

    transcript.markModified("segments");
    await transcript.save();
  }

  // 2. Update MeetingInsights
  const insights = await MeetingInsights.findOne({ meetingId: meeting._id });
  if (insights) {
    if (newSpeakerStats.length > 0) {
      if (!insights.analytics) {
        insights.analytics = {};
      }
      insights.analytics.speakerStats = newSpeakerStats;
      insights.speakerStats = newSpeakerStats;
    }

    // Also update assignees on action items if matching
    if (Array.isArray(insights.actionItems)) {
      insights.actionItems.forEach((item) => {
        if (item.assignee && cleanMapping[item.assignee]) {
          item.assignee = cleanMapping[item.assignee];
        }
      });
      insights.markModified("actionItems");
    }

    // Also update decisions owners if matching
    if (Array.isArray(insights.decisions)) {
      insights.decisions.forEach((d) => {
        if (d.owner && cleanMapping[d.owner]) {
          d.owner = cleanMapping[d.owner];
        }
      });
      insights.markModified("decisions");
    }

    insights.markModified("analytics");
    await insights.save();
  }

  // 3. Update Meeting Participants
  const currentParticipants = meeting.participants || [];
  const updatedParticipantsMap = new Map();

  currentParticipants.forEach((p) => {
    let name = typeof p === "string" ? p : p.name;
    const email = typeof p === "object" ? p.email : undefined;
    if (name && cleanMapping[name]) {
      name = cleanMapping[name];
    }
    if (name) {
      updatedParticipantsMap.set(name.toLowerCase(), { name, email });
    }
  });

  // Ensure all newly renamed speakers exist in meeting.participants
  distinctSpeakers.forEach((name) => {
    if (!updatedParticipantsMap.has(name.toLowerCase())) {
      updatedParticipantsMap.set(name.toLowerCase(), { name });
    }
  });

  meeting.participants = Array.from(updatedParticipantsMap.values());
  meeting.markModified("participants");
  await meeting.save();

  return {
    success: true,
    updatedSegmentsCount,
    speakers: distinctSpeakers,
    speakerStats: newSpeakerStats,
    participants: meeting.participants,
  };
}
