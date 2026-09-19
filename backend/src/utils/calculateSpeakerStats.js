export function calculateSpeakerStats(segments = []) {
  const speakerTimes = new Map();

  for (const segment of segments) {
    const speaker = segment.speaker;

    if (!speaker) {
      continue;
    }

    const startTime = Number(segment.startTime);
    const endTime = Number(segment.endTime);

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(endTime) ||
      endTime <= startTime
    ) {
      continue;
    }

    const talkTime = endTime - startTime;

    speakerTimes.set(
      speaker,
      (speakerTimes.get(speaker) || 0) + talkTime,
    );
  }

  const totalTalkTime = Array.from(speakerTimes.values()).reduce(
    (total, time) => total + time,
    0,
  );

  if (totalTalkTime === 0) {
    return [];
  }

  return Array.from(speakerTimes.entries())
    .map(([speaker, talkTimeSeconds]) => ({
      speaker,
      talkTimeSeconds: Number(talkTimeSeconds.toFixed(2)),
      percentage: Number(
        ((talkTimeSeconds / totalTalkTime) * 100).toFixed(2),
      ),
    }))
    .sort(
      (a, b) => b.talkTimeSeconds - a.talkTimeSeconds,
    );
}