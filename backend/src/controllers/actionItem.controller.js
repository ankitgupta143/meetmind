import {
  updateMeetingActionItem,
  createMeetingActionItem,
  deleteMeetingActionItem,
} from "../services/actionItem.service.js";

export async function updateActionItemController(req, res, next) {
  try {
    const actionItem = await updateMeetingActionItem({
      meetingId: req.params.meetingId,
      userId: req.user.id || req.user._id,
      itemIndex: req.params.itemIndex,
      updates: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Action item updated successfully.",
      data: {
        actionItem,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createActionItemController(req, res, next) {
  try {
    const result = await createMeetingActionItem({
      meetingId: req.params.meetingId,
      userId: req.user.id || req.user._id,
      actionItemData: req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Action item created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteActionItemController(req, res, next) {
  try {
    const result = await deleteMeetingActionItem({
      meetingId: req.params.meetingId,
      userId: req.user.id || req.user._id,
      itemIndex: req.params.itemIndex,
    });

    return res.status(200).json({
      success: true,
      message: "Action item deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
