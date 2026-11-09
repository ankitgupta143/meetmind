import {
  getUserIntegrations,
  connectUserIntegration,
  disconnectUserIntegration,
  syncUserIntegration,
  updateIntegrationConfig,
  postMeetingToSlack,
  importGoogleMeetMeeting,
} from "../services/integration.service.js";

/**
 * Controller: Get all connected integrations for current user
 */
export async function getIntegrationsController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const integrations = await getUserIntegrations(userId);

    return res.status(200).json({
      success: true,
      message: "User integrations retrieved successfully.",
      data: integrations,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Connect integration
 */
export async function connectIntegrationController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const provider = req.params.provider;
    const { name, config, metadata } = req.body || {};

    const integration = await connectUserIntegration({
      userId,
      provider,
      name,
      config,
      metadata,
    });

    return res.status(200).json({
      success: true,
      message: `${integration.name || provider} connected successfully.`,
      data: integration,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Disconnect integration
 */
export async function disconnectIntegrationController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const provider = req.params.provider;

    const result = await disconnectUserIntegration({
      userId,
      provider,
    });

    return res.status(200).json({
      success: true,
      message: `Integration disconnected successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Sync integration
 */
export async function syncIntegrationController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const provider = req.params.provider;

    const result = await syncUserIntegration({
      userId,
      provider,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Update integration configuration
 */
export async function updateIntegrationConfigController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const provider = req.params.provider;
    const { config } = req.body || {};

    const integration = await updateIntegrationConfig({
      userId,
      provider,
      config,
    });

    return res.status(200).json({
      success: true,
      message: `${integration.name || provider} configuration updated successfully.`,
      data: integration,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Post meeting summary to Slack
 */
export async function postMeetingToSlackController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const { meetingId, channel, customNote } = req.body || {};

    const result = await postMeetingToSlack({
      userId,
      meetingId,
      channel,
      customNote,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller: Import Google Meet recording/intelligence into MeetMind
 */
export async function importGoogleMeetMeetingController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const { meetingTitle, date, participants } = req.body || {};

    const result = await importGoogleMeetMeeting({
      userId,
      meetingTitle,
      date,
      participants,
    });

    const meeting = result.meeting || result;

    return res.status(201).json({
      success: true,
      message:
        result.message ||
        `Google Meet meeting '${meeting.title}' imported successfully.`,
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
}
