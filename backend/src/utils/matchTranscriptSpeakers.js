
export function matchTranscriptSpeakers(
  transcriptSegments,
  diarizationSegments,
) {
  return transcriptSegments.map((transcriptSegment) => {
    const segmentObj =
      typeof transcriptSegment?.toObject === "function"
        ? transcriptSegment.toObject()
        : transcriptSegment;

    const startTime = Number(segmentObj.startTime);
    const endTime = Number(segmentObj.endTime);
    const text = segmentObj.text;

    let bestSpeaker = "Speaker 0";
    let bestOverlap = 0;

    for (const diarizationSegment of diarizationSegments) {
      const dStart = Number(diarizationSegment.startTime);
      const dEnd = Number(diarizationSegment.endTime);

      const overlapStart = Math.max(startTime, dStart);
      const overlapEnd = Math.min(endTime, dEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);

      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestSpeaker = diarizationSegment.speaker;
      }
    }

    return {
      startTime,
      endTime,
      text,
      speaker: bestSpeaker,
    };
  });
}
