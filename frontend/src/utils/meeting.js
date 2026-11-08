export function formatMeetingDate(date) {
  const meetingDate = new Date(date);

  if (Number.isNaN(meetingDate.getTime())) {
    return "Unknown date";
  }

  const now = new Date();

  const isToday =
    meetingDate.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    meetingDate.toDateString() === yesterday.toDateString();

  const time = meetingDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today • ${time}`;
  }

  if (isYesterday) {
    return `Yesterday • ${time}`;
  }

  const datePart = meetingDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return `${datePart} • ${time}`;
}

export function formatMeetingDuration(seconds = 0) {
  const totalSeconds = Math.max(Number(seconds) || 0, 0);

  const minutes = Math.floor(totalSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatMeetingStatus(processingStatus) {
  switch (processingStatus) {
    case "completed":
      return "Completed";

    case "processing":
      return "Processing";

    case "pending":
      return "Processing";

    case "failed":
      return "Failed";

    default:
      return "Processing";
  }
}

export function mapMeetingToCard(meeting) {
  return {
    id: meeting._id,
    title: meeting.title,
    date: formatMeetingDate(meeting.meetingDate),
    duration: formatMeetingDuration(meeting.durationSeconds),
    participants: meeting.participants?.length ?? 0,
    status: formatMeetingStatus(meeting.processingStatus),
    isFavorite: Boolean(meeting.isFavorite),
    isPinned: Boolean(meeting.isPinned),
  };
}
