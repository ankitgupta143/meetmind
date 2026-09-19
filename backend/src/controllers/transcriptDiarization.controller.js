import {
    applyTranscriptDiarization,
  previewTranscriptDiarization,
} from "../services/transcriptDiarization.service.js";

export async function previewTranscriptDiarizationController(
  req,
  res,
  next,
) {
  try {
    const result = await previewTranscriptDiarization({
      meetingId: req.params.meetingId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Transcript diarization preview generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}


export async function applyTranscriptDiarizationController(req, res, next){
    try {
        const result = await applyTranscriptDiarization({
            meetingId: req.params.meetingId,
            userId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "Speaker information saved to transcript successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}