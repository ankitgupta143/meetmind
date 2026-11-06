
import api from "@/lib/api";

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
    console.error(
      "[Global Assistant] Request failed:",
      error
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to get a response from MeetMind AI. Please try again."
    );
  }
}
