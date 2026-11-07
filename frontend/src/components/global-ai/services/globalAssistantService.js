import api, { getAccessToken, refreshSession } from "@/lib/api";

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
 * Send a message in a conversation and get the assistant's reply (Synchronous)
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
 * Stream a message in a conversation via Server-Sent Events (SSE)
 */
export async function streamConversationMessageApi({
  conversationId,
  message,
  signal,
  onMetadata,
  onToken,
  onSources,
  onDone,
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${apiUrl}/global-assistant/conversations/${conversationId}/messages?stream=true`;

  let token = getAccessToken();

  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, stream: true }),
    credentials: "include",
    signal,
  });

  // Handle token expiration & auto-refresh
  if (response.status === 401) {
    try {
      const newToken = await refreshSession();
      if (newToken) {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify({ message, stream: true }),
          credentials: "include",
          signal,
        });
      }
    } catch (_) {
      throw new Error("Your session has expired. Please log in again.");
    }
  }

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (!part.trim()) continue;

      const lines = part.split("\n");
      let eventType = "message";
      let eventData = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          eventData = line.slice(5).trim();
        }
      }

      let parsedData = null;
      try {
        parsedData = eventData ? JSON.parse(eventData) : null;
      } catch (_) {
        parsedData = eventData;
      }

      if (eventType === "metadata") {
        onMetadata?.(parsedData);
      } else if (eventType === "token") {
        onToken?.(parsedData);
      } else if (eventType === "sources") {
        onSources?.(parsedData);
      } else if (eventType === "done") {
        onDone?.(parsedData);
      } else if (eventType === "error") {
        throw new Error(parsedData?.message || "AI stream error occurred.");
      }
    }
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
