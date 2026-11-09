import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingInsights from "../models/MeetingInsights.js";
import Transcript from "../models/Transcript.js";

function formatDuration(seconds = 0) {
  if (!seconds || seconds <= 0) return "0 min";
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hrs > 0) {
    return `${hrs} hr ${remainingMins} min`;
  }
  return `${mins} min`;
}

function formatTimestamp(seconds = 0) {
  const totalSecs = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatDate(date) {
  if (!date) return "Recent";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return String(date);
  }
}

/**
 * Format participant list into human-readable string
 */
function formatAttendees(participants = []) {
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return "";
  }
  const names = participants
    .map((p) => {
      if (!p) return null;
      if (typeof p === "string") return p.trim();
      if (typeof p === "object") {
        if (p.name && p.email) return `${p.name} (${p.email})`;
        if (p.name) return p.name;
        if (p.email) return p.email;
        if (p.displayName) return p.displayName;
        return null;
      }
      return String(p);
    })
    .filter(Boolean);

  return names.join(", ");
}

/**
 * Safely compute or retrieve speaker talk percentage
 */
function getSpeakerPercentage(stat, totalDurationSeconds = 0, allStats = []) {
  if (typeof stat.percentage === "number" && !isNaN(stat.percentage) && stat.percentage > 0) {
    return Math.round(stat.percentage);
  }
  if (typeof stat.talkPercentage === "number" && !isNaN(stat.talkPercentage) && stat.talkPercentage > 0) {
    return Math.round(stat.talkPercentage);
  }
  if (typeof stat.share === "number" && !isNaN(stat.share) && stat.share > 0) {
    return Math.round(stat.share);
  }

  const talkSecs = Number(stat.talkTimeSeconds) || 0;
  if (talkSecs > 0) {
    const totalSecs =
      totalDurationSeconds > 0
        ? totalDurationSeconds
        : allStats.reduce((sum, s) => sum + (Number(s.talkTimeSeconds) || 0), 0);
    if (totalSecs > 0) {
      return Math.round((talkSecs / totalSecs) * 100);
    }
  }
  return 0;
}

/**
 * Fetch all meeting data and verify user access
 */
export async function getMeetingExportData({ meetingId, userId }) {
  if (!meetingId || !userId) {
    const error = new Error("Meeting ID and User ID are required.");
    error.code = "PARAMS_REQUIRED";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  }).lean();

  if (!meeting) {
    const error = new Error("Meeting not found or access denied.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const [insights, transcript] = await Promise.all([
    MeetingInsights.findOne({ meetingId: meeting._id }).lean(),
    Transcript.findOne({ meetingId: meeting._id }).lean(),
  ]);

  return {
    meeting,
    insights: insights || {},
    transcript: transcript || {},
  };
}

/**
 * Generate Markdown Export
 */
export function generateMarkdownExport({ meeting, insights, transcript, sections = [], settings = {} }) {
  const includeAll = !sections || sections.length === 0;
  const hasSection = (name) => includeAll || sections.some((s) => s.toLowerCase() === name.toLowerCase());
  const includeTimestamps = settings.includeTimestamps !== false;
  const includeBranding = settings.includeBranding !== false;

  let md = "";

  // Title & Metadata
  md += `# ${meeting.title}\n\n`;
  md += `**Date:** ${formatDate(meeting.meetingDate || meeting.createdAt)}  \n`;
  md += `**Duration:** ${formatDuration(meeting.durationSeconds)}  \n`;
  const attendeesMd = formatAttendees(meeting.participants);
  if (attendeesMd) {
    md += `**Participants:** ${attendeesMd}  \n`;
  }
  md += `\n---\n\n`;

  // Summary Section
  if (hasSection("Summary")) {
    md += `## 📋 Executive Summary\n\n`;
    if (insights.summary?.overview) {
      md += `${insights.summary.overview}\n\n`;
    } else {
      md += `*No summary overview available for this meeting.*\n\n`;
    }

    if (insights.summary?.keyTakeaways && insights.summary.keyTakeaways.length > 0) {
      md += `### Key Takeaways\n\n`;
      insights.summary.keyTakeaways.forEach((takeaway) => {
        md += `- ${takeaway}\n`;
      });
      md += `\n`;
    }
  }

  // Action Items Section
  if (hasSection("Action Items")) {
    md += `## ✅ Action Items & Deliverables\n\n`;
    const items = insights.actionItems || [];
    if (items.length > 0) {
      md += `| Status | Deliverable | Assignee | Priority | Due Date |\n`;
      md += `| :---: | :--- | :--- | :---: | :--- |\n`;
      items.forEach((item) => {
        const statusIcon = item.status === "completed" ? "☑️ Done" : "⏳ Pending";
        const assignee = item.assignee ? `@${item.assignee}` : "Unassigned";
        const priority = (item.priority || "medium").toUpperCase();
        const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-";
        md += `| ${statusIcon} | **${item.title}**${item.description ? `<br>*${item.description}*` : ""} | ${assignee} | ${priority} | ${dueDate} |\n`;
      });
      md += `\n`;
    } else {
      md += `*No action items logged for this meeting.*\n\n`;
    }
  }

  // Decisions Section
  if (hasSection("Decisions")) {
    md += `## 🎯 Key Decisions\n\n`;
    const decisions = insights.decisions || [];
    if (decisions.length > 0) {
      decisions.forEach((d, idx) => {
        md += `### ${idx + 1}. ${d.title}\n`;
        if (d.rationale) md += `**Rationale:** ${d.rationale}  \n`;
        if (d.context) md += `**Context:** ${d.context}  \n`;
        if (d.impact) md += `**Impact:** ${d.impact}  \n`;
        md += `\n`;
      });
    } else {
      md += `*No decisions recorded for this meeting.*\n\n`;
    }
  }

  // Analytics Section
  if (hasSection("Analytics")) {
    md += `## 📊 Meeting Analytics\n\n`;
    const stats = insights.analytics?.speakerStats || insights.speakerStats || [];
    if (stats.length > 0) {
      md += `| Speaker | Talk Time | Talk % | Words |\n`;
      md += `| :--- | :---: | :---: | :---: |\n`;
      stats.forEach((s) => {
        const pct = getSpeakerPercentage(s, meeting.durationSeconds, stats);
        md += `| **${s.speaker}** | ${formatDuration(s.talkTimeSeconds)} | ${pct}% | ${s.wordCount || "-"} |\n`;
      });
      md += `\n`;
    }

    if (insights.analytics?.sentiment) {
      md += `**Overall Sentiment:** ${insights.analytics.sentiment}  \n\n`;
    }
  }

  // Transcript Section
  if (hasSection("Transcript")) {
    md += `## 🎙️ Diarized Transcript\n\n`;
    const segments = transcript.segments || [];
    if (segments.length > 0) {
      segments.forEach((seg) => {
        const timeTag = includeTimestamps
          ? `\`[${formatTimestamp(seg.startTime)} - ${formatTimestamp(seg.endTime)}]\` `
          : "";
        md += `${timeTag}**${seg.speaker}:** ${seg.text}\n\n`;
      });
    } else if (transcript.fullText) {
      md += `${transcript.fullText}\n\n`;
    } else {
      md += `*No transcript available.*\n\n`;
    }
  }

  // Branding
  if (includeBranding) {
    md += `---\n*Generated by MeetMind AI Intelligence • Confidential*\n`;
  }

  return md;
}

/**
 * Generate Plain Text Export
 */
export function generatePlainTextExport({ meeting, insights, transcript, sections = [], settings = {} }) {
  const includeAll = !sections || sections.length === 0;
  const hasSection = (name) => includeAll || sections.some((s) => s.toLowerCase() === name.toLowerCase());
  const includeTimestamps = settings.includeTimestamps !== false;
  const includeBranding = settings.includeBranding !== false;

  const divider = "=".repeat(68);
  const subDivider = "-".repeat(68);
  let txt = "";

  txt += `${divider}\n`;
  txt += `MEETMIND INTELLIGENCE REPORT: ${meeting.title.toUpperCase()}\n`;
  txt += `${divider}\n\n`;
  txt += `Date:        ${formatDate(meeting.meetingDate || meeting.createdAt)}\n`;
  txt += `Duration:    ${formatDuration(meeting.durationSeconds)}\n`;
  const attendeesTxt = formatAttendees(meeting.participants);
  if (attendeesTxt) {
    txt += `Attendees:   ${attendeesTxt}\n`;
  }
  txt += `\n`;

  if (hasSection("Summary")) {
    txt += `${subDivider}\nEXECUTIVE SUMMARY\n${subDivider}\n\n`;
    txt += `${insights.summary?.overview || "No summary overview available."}\n\n`;
    if (insights.summary?.keyTakeaways?.length > 0) {
      txt += `Key Takeaways:\n`;
      insights.summary.keyTakeaways.forEach((t) => {
        txt += `  * ${t}\n`;
      });
      txt += `\n`;
    }
  }

  if (hasSection("Action Items")) {
    txt += `${subDivider}\nACTION ITEMS & DELIVERABLES\n${subDivider}\n\n`;
    const items = insights.actionItems || [];
    if (items.length > 0) {
      items.forEach((item, idx) => {
        const status = item.status === "completed" ? "[DONE]" : "[PENDING]";
        const assignee = item.assignee ? `@${item.assignee}` : "Unassigned";
        txt += `${idx + 1}. ${status} ${item.title} (${assignee}, Priority: ${item.priority || "medium"})\n`;
        if (item.description) txt += `   Note: ${item.description}\n`;
      });
      txt += `\n`;
    } else {
      txt += `No action items logged.\n\n`;
    }
  }

  if (hasSection("Decisions")) {
    txt += `${subDivider}\nKEY DECISIONS\n${subDivider}\n\n`;
    const decisions = insights.decisions || [];
    if (decisions.length > 0) {
      decisions.forEach((d, idx) => {
        txt += `${idx + 1}. ${d.title}\n`;
        if (d.rationale) txt += `   Rationale: ${d.rationale}\n`;
        if (d.impact) txt += `   Impact:    ${d.impact}\n`;
      });
      txt += `\n`;
    } else {
      txt += `No decisions logged.\n\n`;
    }
  }

  if (hasSection("Analytics")) {
    txt += `${subDivider}\nSPEAKER ANALYTICS\n${subDivider}\n\n`;
    const stats = insights.analytics?.speakerStats || insights.speakerStats || [];
    if (stats.length > 0) {
      stats.forEach((s) => {
        const pct = getSpeakerPercentage(s, meeting.durationSeconds, stats);
        txt += `  * ${s.speaker}: ${formatDuration(s.talkTimeSeconds)} (${pct}%)\n`;
      });
      txt += `\n`;
    }
  }

  if (hasSection("Transcript")) {
    txt += `${subDivider}\nDIARIZED TRANSCRIPT\n${subDivider}\n\n`;
    const segments = transcript.segments || [];
    if (segments.length > 0) {
      segments.forEach((seg) => {
        const timeTag = includeTimestamps
          ? `[${formatTimestamp(seg.startTime)} - ${formatTimestamp(seg.endTime)}] `
          : "";
        txt += `${timeTag}${seg.speaker}: ${seg.text}\n\n`;
      });
    } else if (transcript.fullText) {
      txt += `${transcript.fullText}\n\n`;
    }
  }

  if (includeBranding) {
    txt += `\n${divider}\nGenerated by MeetMind AI Intelligence Platform\n${divider}\n`;
  }

  return txt;
}

/**
 * Generate Standalone Styled HTML Export (Print/PDF-ready)
 */
export function generateHtmlExport({ meeting, insights, transcript, sections = [], settings = {} }) {
  const includeAll = !sections || sections.length === 0;
  const hasSection = (name) => includeAll || sections.some((s) => s.toLowerCase() === name.toLowerCase());
  const includeTimestamps = settings.includeTimestamps !== false;
  const includeBranding = settings.includeBranding !== false;
  const pageSize = settings.pageSize || "A4";

  let bodyHtml = "";

  // Executive Summary
  if (hasSection("Summary")) {
    bodyHtml += `
      <section class="section">
        <h2>Executive Summary</h2>
        <p class="lead">${insights.summary?.overview || "No summary overview available."}</p>
        ${
          insights.summary?.keyTakeaways?.length > 0
            ? `<h3>Key Takeaways</h3>
               <ul>
                 ${insights.summary.keyTakeaways.map((t) => `<li>${t}</li>`).join("")}
               </ul>`
            : ""
        }
      </section>
    `;
  }

  // Action Items
  if (hasSection("Action Items")) {
    const items = insights.actionItems || [];
    bodyHtml += `
      <section class="section">
        <h2>Action Items & Deliverables (${items.length})</h2>
        ${
          items.length > 0
            ? `<table>
                 <thead>
                   <tr>
                     <th style="width: 15%">Status</th>
                     <th style="width: 45%">Deliverable</th>
                     <th style="width: 20%">Assignee</th>
                     <th style="width: 20%">Priority</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${items
                     .map(
                       (item) => `
                     <tr>
                       <td><span class="badge ${item.status === "completed" ? "badge-success" : "badge-pending"}">${item.status === "completed" ? "Completed" : "Pending"}</span></td>
                       <td><strong>${item.title}</strong>${item.description ? `<br><small style="color: #64748b">${item.description}</small>` : ""}</td>
                       <td>${item.assignee ? `@${item.assignee}` : "Unassigned"}</td>
                       <td><span class="badge badge-${item.priority || "medium"}">${(item.priority || "medium").toUpperCase()}</span></td>
                     </tr>
                   `
                     )
                     .join("")}
                 </tbody>
               </table>`
            : `<p class="muted">No action items logged for this meeting.</p>`
        }
      </section>
    `;
  }

  // Decisions
  if (hasSection("Decisions")) {
    const decisions = insights.decisions || [];
    bodyHtml += `
      <section class="section">
        <h2>Key Decisions (${decisions.length})</h2>
        ${
          decisions.length > 0
            ? `<div class="card-grid">
                 ${decisions
                   .map(
                     (d, idx) => `
                   <div class="card">
                     <div class="card-title"><strong>#${idx + 1}</strong> ${d.title}</div>
                     ${d.rationale ? `<p><strong>Rationale:</strong> ${d.rationale}</p>` : ""}
                     ${d.impact ? `<p><strong>Impact:</strong> ${d.impact}</p>` : ""}
                   </div>
                 `
                   )
                   .join("")}
               </div>`
            : `<p class="muted">No key decisions logged.</p>`
        }
      </section>
    `;
  }

  // Speaker Analytics
  if (hasSection("Analytics")) {
    const stats = insights.analytics?.speakerStats || insights.speakerStats || [];
    bodyHtml += `
      <section class="section">
        <h2>Speaker Participation Analytics</h2>
        ${
          stats.length > 0
            ? `<table>
                 <thead>
                   <tr>
                     <th>Speaker</th>
                     <th>Talk Time</th>
                     <th>Talk Share</th>
                     <th>Word Count</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${stats
                     .map(
                       (s) => `
                     <tr>
                       <td><strong>${s.speaker}</strong></td>
                       <td>${formatDuration(s.talkTimeSeconds)}</td>
                       <td>${getSpeakerPercentage(s, meeting.durationSeconds, stats)}%</td>
                       <td>${s.wordCount || "-"}</td>
                     </tr>
                   `
                     )
                     .join("")}
                 </tbody>
               </table>`
            : `<p class="muted">No speaker analytics available.</p>`
        }
      </section>
    `;
  }

  // Diarized Transcript
  if (hasSection("Transcript")) {
    const segments = transcript.segments || [];
    bodyHtml += `
      <section class="section page-break">
        <h2>Diarized Transcript</h2>
        ${
          segments.length > 0
            ? `<div class="transcript-list">
                 ${segments
                   .map(
                     (seg) => `
                   <div class="transcript-entry">
                     <div class="transcript-meta">
                       <strong>${seg.speaker}</strong>
                       ${includeTimestamps ? `<span>${formatTimestamp(seg.startTime)} - ${formatTimestamp(seg.endTime)}</span>` : ""}
                     </div>
                     <p>${seg.text}</p>
                   </div>
                 `
                   )
                   .join("")}
               </div>`
            : transcript.fullText
            ? `<p>${transcript.fullText}</p>`
            : `<p class="muted">No transcript available.</p>`
        }
      </section>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${meeting.title} - MeetMind Meeting Report</title>
  <style>
    @page { size: ${pageSize}; margin: 20mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 32px;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #4f46e5;
      background: #eef2ff;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    h1 { font-size: 28px; margin: 0 0 12px 0; color: #0f172a; font-weight: 800; letter-spacing: -0.02em; }
    .meta-bar { display: flex; gap: 20px; font-size: 13px; color: #64748b; flex-wrap: wrap; }
    .section { margin-bottom: 36px; }
    h2 { font-size: 20px; color: #1e293b; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
    h3 { font-size: 15px; color: #334155; margin: 16px 0 8px 0; }
    p.lead { font-size: 15px; color: #334155; }
    ul { padding-left: 20px; color: #334155; }
    li { margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .badge { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-high { background: #fee2e2; color: #991b1b; }
    .badge-medium { background: #fef3c7; color: #92400e; }
    .badge-low { background: #f1f5f9; color: #475569; }
    .card-grid { display: grid; gap: 12px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
    .card-title { font-size: 14px; margin-bottom: 8px; color: #0f172a; }
    .card p { margin: 4px 0; font-size: 13px; color: #475569; }
    .transcript-entry { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f8fafc; }
    .transcript-meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 4px; }
    .transcript-entry p { margin: 0; font-size: 13px; color: #1e293b; }
    .muted { color: #94a3b8; font-style: italic; font-size: 13px; }
    footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px; }
    @media print {
      body { padding: 0; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <header>
    ${includeBranding ? `<div class="brand">MeetMind AI Intelligence Report</div>` : ""}
    <h1>${meeting.title}</h1>
    <div class="meta-bar">
      <span><strong>Date:</strong> ${formatDate(meeting.meetingDate || meeting.createdAt)}</span>
      <span><strong>Duration:</strong> ${formatDuration(meeting.durationSeconds)}</span>
      ${formatAttendees(meeting.participants) ? `<span><strong>Attendees:</strong> ${formatAttendees(meeting.participants)}</span>` : ""}
    </div>
  </header>

  <main>
    ${bodyHtml}
  </main>

  ${includeBranding ? `<footer>Generated by MeetMind AI Intelligence • Confidential & Proprietary</footer>` : ""}
</body>
</html>`;
}

/**
 * Generate Structured JSON Export
 */
export function generateJsonExport({ meeting, insights, transcript, sections = [] }) {
  const includeAll = !sections || sections.length === 0;
  const hasSection = (name) => includeAll || sections.some((s) => s.toLowerCase() === name.toLowerCase());

  const data = {
    exportedAt: new Date().toISOString(),
    meeting: {
      id: meeting._id,
      title: meeting.title,
      meetingDate: meeting.meetingDate,
      durationSeconds: meeting.durationSeconds,
      participants: meeting.participants || [],
    },
  };

  if (hasSection("Summary")) {
    data.summary = insights.summary || {};
  }
  if (hasSection("Action Items")) {
    data.actionItems = insights.actionItems || [];
  }
  if (hasSection("Decisions")) {
    data.decisions = insights.decisions || [];
  }
  if (hasSection("Analytics")) {
    const rawStats = insights.analytics?.speakerStats || insights.speakerStats || [];
    data.analytics = {
      sentiment: insights.analytics?.sentiment || insights.sentiment || "Neutral",
      speakerStats: rawStats.map((s) => ({
        speaker: s.speaker,
        talkTimeSeconds: s.talkTimeSeconds || 0,
        percentage: getSpeakerPercentage(s, meeting.durationSeconds, rawStats),
        wordCount: s.wordCount,
      })),
    };
  }
  if (hasSection("Transcript")) {
    data.transcript = {
      segments: transcript.segments || [],
      fullText: transcript.fullText || "",
    };
  }

  return JSON.stringify(data, null, 2);
}

/**
 * Generate Pure JS PDF Document (Standard PDF-1.4 spec, zero external dependencies)
 */
export function generatePdfExport({ meeting, insights, transcript, sections = [], settings = {} }) {
  // A clean, valid PDF-1.4 text stream
  const includeAll = !sections || sections.length === 0;
  const hasSection = (name) => includeAll || sections.some((s) => s.toLowerCase() === name.toLowerCase());

  const lines = [];
  lines.push(`MEETMIND AI INTELLIGENCE REPORT`);
  lines.push(`================================`);
  lines.push(`Meeting: ${meeting.title}`);
  lines.push(`Date:    ${formatDate(meeting.meetingDate || meeting.createdAt)}`);
  lines.push(`Duration: ${formatDuration(meeting.durationSeconds)}`);
  const attendeesPdf = formatAttendees(meeting.participants);
  if (attendeesPdf) {
    lines.push(`Attendees: ${attendeesPdf}`);
  }
  lines.push(``);

  if (hasSection("Summary")) {
    lines.push(`EXECUTIVE SUMMARY`);
    lines.push(`-----------------`);
    if (insights.summary?.overview) {
      lines.push(insights.summary.overview);
    }
    if (insights.summary?.keyTakeaways?.length > 0) {
      lines.push(`Key Takeaways:`);
      insights.summary.keyTakeaways.forEach((t) => lines.push(` - ${t}`));
    }
    lines.push(``);
  }

  if (hasSection("Action Items")) {
    lines.push(`ACTION ITEMS & DELIVERABLES`);
    lines.push(`---------------------------`);
    const items = insights.actionItems || [];
    if (items.length > 0) {
      items.forEach((item, idx) => {
        const status = item.status === "completed" ? "[DONE]" : "[PENDING]";
        const assignee = item.assignee ? `@${item.assignee}` : "Unassigned";
        lines.push(`${idx + 1}. ${status} ${item.title} (${assignee}, ${item.priority || "med"})`);
      });
    } else {
      lines.push(`No action items recorded.`);
    }
    lines.push(``);
  }

  if (hasSection("Decisions")) {
    lines.push(`KEY DECISIONS`);
    lines.push(`-------------`);
    const decisions = insights.decisions || [];
    if (decisions.length > 0) {
      decisions.forEach((d, idx) => {
        lines.push(`${idx + 1}. ${d.title}`);
        if (d.rationale) lines.push(`   Rationale: ${d.rationale}`);
      });
    } else {
      lines.push(`No decisions recorded.`);
    }
    lines.push(``);
  }

  if (hasSection("Analytics")) {
    lines.push(`SPEAKER PARTICIPATION`);
    lines.push(`---------------------`);
    const stats = insights.analytics?.speakerStats || insights.speakerStats || [];
    stats.forEach((s) => {
      const pct = getSpeakerPercentage(s, meeting.durationSeconds, stats);
      lines.push(` - ${s.speaker}: ${formatDuration(s.talkTimeSeconds)} (${pct}%)`);
    });
    lines.push(``);
  }

  if (hasSection("Transcript")) {
    lines.push(`TRANSCRIPT HIGHLIGHTS`);
    lines.push(`---------------------`);
    const segments = transcript.segments || [];
    segments.slice(0, 50).forEach((seg) => {
      lines.push(`[${formatTimestamp(seg.startTime)}] ${seg.speaker}: ${seg.text}`);
    });
    if (segments.length > 50) {
      lines.push(`... (${segments.length - 50} more segments omitted in PDF quick print)`);
    }
    lines.push(``);
  }

  if (settings.includeBranding !== false) {
    lines.push(`Generated by MeetMind AI • Confidential`);
  }

  // Construct PDF-1.4 stream
  const escapedTextLines = lines.map((l) =>
    l.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
  );

  let streamContent = `BT\n/F1 10 Tf\n50 780 Td\n14 TL\n`;
  escapedTextLines.forEach((line) => {
    streamContent += `(${line}) '\n`;
  });
  streamContent += `ET\n`;

  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const pdfParts = [
    `%PDF-1.4\n`,
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}endstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `xref\n0 6\n0000000000 65535 f \n`,
  ];

  // Calculate byte offsets
  let offset = 0;
  const offsets = [];
  offsets.push(0); // 0
  offset += Buffer.byteLength(pdfParts[0], "utf-8");
  offsets.push(offset); // 1
  offset += Buffer.byteLength(pdfParts[1], "utf-8");
  offsets.push(offset); // 2
  offset += Buffer.byteLength(pdfParts[2], "utf-8");
  offsets.push(offset); // 3
  offset += Buffer.byteLength(pdfParts[3], "utf-8");
  offsets.push(offset); // 4
  offset += Buffer.byteLength(pdfParts[4], "utf-8");
  offsets.push(offset); // 5

  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${offset + Buffer.byteLength(pdfParts[5], "utf-8")}\n%%EOF\n`;

  const fullPdf =
    pdfParts[0] +
    pdfParts[1] +
    pdfParts[2] +
    pdfParts[3] +
    pdfParts[4] +
    pdfParts[5] +
    xref +
    trailer;

  return Buffer.from(fullPdf, "binary");
}

/**
 * Main export coordinator
 */
export async function exportMeetingDossier({
  meetingId,
  userId,
  format = "markdown",
  sections = [],
  settings = {},
}) {
  const data = await getMeetingExportData({ meetingId, userId });
  const normalizedFormat = (format || "markdown").toLowerCase();

  switch (normalizedFormat) {
    case "html":
      return {
        content: generateHtmlExport({ ...data, sections, settings }),
        contentType: "text/html; charset=utf-8",
        extension: "html",
      };
    case "text":
    case "txt":
      return {
        content: generatePlainTextExport({ ...data, sections, settings }),
        contentType: "text/plain; charset=utf-8",
        extension: "txt",
      };
    case "json":
      return {
        content: generateJsonExport({ ...data, sections }),
        contentType: "application/json; charset=utf-8",
        extension: "json",
      };
    case "pdf":
      return {
        content: generatePdfExport({ ...data, sections, settings }),
        contentType: "application/pdf",
        extension: "pdf",
      };
    case "docx":
    case "markdown":
    case "md":
    default:
      return {
        content: generateMarkdownExport({ ...data, sections, settings }),
        contentType: "text/markdown; charset=utf-8",
        extension: "md",
      };
  }
}
