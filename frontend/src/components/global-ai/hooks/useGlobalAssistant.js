import { useMemo, useState } from "react";
import { INITIAL_CONVERSATIONS } from "../data/assistantData";
import { askGlobalAssistant } from "../services/globalAssistantService";

const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date(),
});

export default function useGlobalAssistant() {
  const [chatGroups, setChatGroups] = useState(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState("welcome");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responsePhase, setResponsePhase] = useState(null);
  const activeChat = useMemo(
    () =>
      chatGroups
        .flatMap((group) => group.items)
        .find((chat) => chat.id === activeChatId),
    [activeChatId, chatGroups],
  );

  const updateActiveChat = (updater) =>
    setChatGroups((groups) =>
      groups.map((group) => ({
        ...group,
        items: group.items.map((chat) =>
          chat.id === activeChatId ? updater(chat) : chat,
        ),
      })),
    );

  const createConversation = () => {
    const id = crypto.randomUUID();
    setChatGroups((groups) =>
      groups.map((group, index) =>
        index === 0
          ? {
              ...group,
              items: [
                { id, title: "New conversation", messages: [] },
                ...group.items,
              ],
            }
          : group,
      ),
    );
    setActiveChatId(id);
    setInput("");
  };

  const sendMessage = async (prompt = input) => {
    const text = prompt.trim();
    if (!text || isLoading) return;
    if (!activeChat) return;
    updateActiveChat((chat) => ({
      ...chat,
      title: chat.messages.length ? chat.title : text.slice(0, 32),
      messages: [...chat.messages, createMessage("user", text)],
    }));
    setInput("");
    setIsLoading(true);
    setResponsePhase("searching");
    try {
      const answer = await askGlobalAssistant(text);
      const assistantMessage = createMessage("assistant", "");
      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, assistantMessage],
      }));
      setResponsePhase("streaming");

      for (let index = 1; index <= answer.length; index += 3) {
        await new Promise((resolve) => window.setTimeout(resolve, 9));
        const content = answer.slice(0, index);
        updateActiveChat((chat) => ({
          ...chat,
          messages: chat.messages.map((message) =>
            message.id === assistantMessage.id ? { ...message, content } : message,
          ),
        }));
      }
    } finally {
      setResponsePhase(null);
      setIsLoading(false);
    }
  };

  return {
    activeChat,
    activeChatId,
    chatGroups,
    createConversation,
    input,
    isLoading,
    responsePhase,
    messages: activeChat?.messages || [],
    sendMessage,
    setActiveChatId,
    setInput,
  };
}
