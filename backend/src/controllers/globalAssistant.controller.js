import { askGlobalAssistant } from "../services/globalAssistant.service.js";

export async function globalAssistantController(req, res, next) {
  try {
    const { message } = req.body;
    const result = await askGlobalAssistant({
      userId: req.user.id,
      message,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
