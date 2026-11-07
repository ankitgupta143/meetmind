import api from "@/lib/api";

/**
 * Legacy direct chat endpoint
 */
export async function askGlobalAssistant(prompt) {
  try {
    const response = await api.post("/global-assistant/chat", {
      message: prompt,
    });

    const answer = response.data?.data?.message;

    if (!answer) {
      throw new Error("AI returned an empty response.");
    }

    return answer;
  } catch (error) {
    console.error("[Global Assistant] Request failed:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to get a response from MeetMind AI. Please try again."
    );
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(title = "New conversation") {
  try {
    const response = await api.post("/global-assistant/conversations", {
      title,
    });
    return response.data?.data?.conversation;
  } catch (error) {
    console.error("[Global Assistant] Failed to create conversation:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create conversation."
    );
  }
}

/**
 * Fetch list of conversations for sidebar history
 */
export async function getConversations(page = 1, limit = 30) {
  try {
    const response = await api.get(
      `/global-assistant/conversations?page=${page}&limit=${limit}`
    );
    return response.data?.data;
  } catch (error) {
    console.error("[Global Assistant] Failed to fetch conversations:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch conversation history."
    );
  }
}

/**
 * Fetch full conversation details including messages
 */
export async function getConversationById(conversationId) {
  try {
    const response = await api.get(
      `/global-assistant/conversations/${conversationId}`
    );
    return response.data?.data?.conversation;
  } catch (error) {
    console.error("[Global Assistant] Failed to fetch conversation:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch conversation."
    );
  }
}

/**
 * Send a message in a conversation and get the assistant's reply
 */
export async function sendConversationMessage(conversationId, message) {
  try {
    const response = await api.post(
      `/global-assistant/conversations/${conversationId}/messages`,
      { message }
    );
    return response.data?.data;
  } catch (error) {
    console.error("[Global Assistant] Failed to send message:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to send message."
    );
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId) {
  try {
    const response = await api.delete(
      `/global-assistant/conversations/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error("[Global Assistant] Failed to delete conversation:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete conversation."
    );
  }
}

/**
 * Rename a conversation
 */
export async function updateConversationTitle(conversationId, title) {
  try {
    const response = await api.patch(
      `/global-assistant/conversations/${conversationId}`,
      { title }
    );
    return response.data?.data?.conversation;
  } catch (error) {
    console.error("[Global Assistant] Failed to update title:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update conversation title."
    );
  }
}
