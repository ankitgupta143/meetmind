import {
  updateMeetingActionItem,
} from "../services/actionItem.service.js";

export async function updateActionItemController(
  req,
  res,
  next,
) {
  try {
    const actionItem =
      await updateMeetingActionItem({
        meetingId: req.params.meetingId,
        userId: req.user.id,
        itemIndex: req.params.itemIndex,
        updates: req.body,
      });

    return res.status(200).json({
      success: true,
      message:
        "Action item updated successfully.",
      data: {
        actionItem,
      },
    });
  } catch (error) {
    next(error);
  }
}