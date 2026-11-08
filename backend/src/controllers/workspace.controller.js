import {
  getWorkspaceOverview,
  toggleMeetingFavorite,
  toggleMeetingPin,
  toggleWorkspaceActionItem,
} from "../services/workspace.service.js";

/**
 * Controller: Get full workspace hub overview (stats, collections, recent activity)
 */
export async function getWorkspaceOverviewController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const overview = await getWorkspaceOverview({ userId });

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Toggle meeting favorite flag
 */
export async function toggleFavoriteMeetingController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const { meetingId } = req.params;

    const result = await toggleMeetingFavorite({ meetingId, userId });

    return res.status(200).json({
      success: true,
      message: result.isFavorite
        ? "Meeting added to favorites"
        : "Meeting removed from favorites",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Toggle meeting pinned flag
 */
export async function togglePinMeetingController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const { meetingId } = req.params;

    const result = await toggleMeetingPin({ meetingId, userId });

    return res.status(200).json({
      success: true,
      message: result.isPinned
        ? "Meeting pinned to workspace"
        : "Meeting unpinned from workspace",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Toggle or update status of action item across any meeting
 */
export async function toggleWorkspaceActionItemController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const { meetingId, itemIndex } = req.params;
    const { status } = req.body || {};

    const result = await toggleWorkspaceActionItem({
      meetingId,
      itemIndex,
      userId,
      targetStatus: status,
    });

    return res.status(200).json({
      success: true,
      message: `Action item marked as ${result.status}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
