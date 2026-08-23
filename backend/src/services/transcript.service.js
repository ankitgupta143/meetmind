import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";

/**
 * Fetch a meeting's transcript with optional search, speaker filter,
 * and pagination of the segments array.
 *
 * @param {object} opts
 * @param {string} opts.userId
 * @param {string} opts.meetingId
 * @param {string} [opts.search]   - case-insensitive substring match on segment text & speaker
 * @param {string} [opts.speaker]  - exact speaker name filter
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=50]
 *
 * @returns {{ transcript: object, pagination: object } | null}
 */
export async function getMeetingTranscript({
  userId,
  meetingId,
  search = "",
  speaker = "",
  page = 1,
  limit = 50,
}) {
  // 1. Verify ownership
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) return null;

  // 2. Fetch the transcript document (all fields except the full segments array
  //    so we can filter in JS — segments are an embedded array, not a collection)
  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
  }).lean();

  if (!transcript) return null;

  // 3. Filter segments
  let segments = transcript.segments ?? [];

  if (speaker) {
    segments = segments.filter(
      (seg) => seg.speaker?.toLowerCase() === speaker.toLowerCase()
    );
  }

  if (search) {
    const regex = new RegExp(search, "i");
    segments = segments.filter(
      (seg) => regex.test(seg.text) || regex.test(seg.speaker)
    );
  }

  // 4. Paginate
  const totalSegments = segments.length;
  const totalPages = Math.ceil(totalSegments / limit) || 1;
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * limit;
  const pageSegments = segments.slice(offset, offset + limit);

  // 5. Derive unique speakers from the *full* (pre-filter) segment list so the
  //    UI can always populate the speaker dropdown regardless of active filters.
  const allSpeakers = [
    ...new Set(
      (transcript.segments ?? []).map((s) => s.speaker).filter(Boolean)
    ),
  ].sort();

  return {
    transcript: {
      ...transcript,
      segments: pageSegments,
    },
    pagination: {
      totalSegments,
      totalPages,
      page: safePage,
      limit,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
    speakers: allSpeakers,
  };
}