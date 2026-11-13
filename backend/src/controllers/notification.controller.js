import {
  deleteNotification,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service.js";

export async function getNotificationsController(req, res, next) {
  try {
    const { filter = "all", limit = 20, page = 1 } = req.query;

    const data = await getUserNotifications(req.user.id, {
      filter,
      limit,
      page,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsReadController(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await markNotificationAsRead(id, req.user.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsAsReadController(req, res, next) {
  try {
    await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotificationController(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteNotification(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
