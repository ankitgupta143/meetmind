"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function useAssistantChat(propMeetingId) {
  const params = useParams();
  const meetingId = propMeetingId || params?.id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    const text = message || input;

    if (!text.trim() || !meetingId || isLoading) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post(
        `/meetings/${meetingId}/assistant`,
        {
          message: text.trim(),
        }
      );

      const assistantContent =
        response.data?.data?.message ||
        "I couldn't generate a response.";

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        createdAt: new Date(),
        status: "completed",
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Assistant request failed:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Sorry, I couldn't process your question.";

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorMessage,
        createdAt: new Date(),
        status: "error",
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateResponse = async (
    assistantMessageId
  ) => {
    if (isLoading || !meetingId) {
      return;
    }

    const assistantIndex = messages.findIndex(
      (message) =>
        message.id === assistantMessageId
    );

    if (assistantIndex === -1) {
      return;
    }

    const previousUserMessage = [...messages]
      .slice(0, assistantIndex)
      .reverse()
      .find(
        (message) => message.role === "user"
      );

    if (!previousUserMessage) {
      return;
    }

    setIsLoading(true);

    setMessages((prev) =>
      prev.map((message) =>
        message.id === assistantMessageId
          ? {
              ...message,
              content: "",
              status: "streaming",
            }
          : message
      )
    );

    try {
      const response = await api.post(
        `/meetings/${meetingId}/assistant`,
        {
          message: previousUserMessage.content,
        }
      );

      const assistantContent =
        response.data?.data?.message ||
        "I couldn't generate a response.";

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: assistantContent,
                status: "completed",
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "AI Assistant regeneration failed:",
        error
      );

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  error.response?.data?.message ||
                  "Sorry, I couldn't regenerate the response.",
                status: "error",
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  return {
    messages,
    input,
    isLoading,
    setInput,
    sendMessage,
    clearConversation,
    regenerateResponse,
  };
}
