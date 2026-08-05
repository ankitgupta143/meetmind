"use client";

import { useState } from "react";

import { getResponse } from "../services/mockAssistant";

export default function useAssistantChat() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const streamResponse = (text, onUpdate, onComplete) => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      onUpdate(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 12); // Adjust speed (10–20ms feels natural)
  };

  const sendMessage = async (message) => {
    const text = message || input;

    if (!text.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setIsLoading(true);

    const fullResponse = getResponse(text);

    const assistantId = crypto.randomUUID();

    const assistantMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
      status: "streaming",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    streamResponse(
      fullResponse,

      (partialText) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: partialText,
                }
              : message,
          ),
        );
      },

      () => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  status: "completed",
                }
              : message,
          ),
        );

        setIsLoading(false);
      },
    );
  };

  const regenerateResponse = (assistantMessageId) => {
    setIsLoading(true);

    setMessages((prevMessages) => {
      const assistantIndex = prevMessages.findIndex(
        (message) => message.id === assistantMessageId,
      );

      if (assistantIndex === -1) {
        setIsLoading(false);
        return prevMessages;
      }

      const previousUserMessage = [...prevMessages]
        .slice(0, assistantIndex)
        .reverse()
        .find((message) => message.role === "user");

      if (!previousUserMessage) {
        setIsLoading(false);
        return prevMessages;
      }

      const fullResponse = getResponse(previousUserMessage.content);

      streamResponse(
        fullResponse,
        (partialText) => {
          setMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: partialText,
                    status: "streaming",
                  }
                : message,
            ),
          );
        },
        () => {
          setMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    status: "completed",
                  }
                : message,
            ),
          );

          setIsLoading(false);
        },
      );

      return prevMessages.map((message) =>
        message.id === assistantMessageId
          ? {
              ...message,
              content: "",
              status: "streaming",
            }
          : message,
      );
    });
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
