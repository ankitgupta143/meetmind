"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  getConversationById,
  sendConversationMessage,
  deleteConversation as deleteConversationApi,
  updateConversationTitle as updateConversationTitleApi,
} from "../services/globalAssistantService";
import { groupConversationsByDate } from "../data/assistantData";

const ACTIVE_CHAT_STORAGE_KEY = "meetmind_active_chat_id";

export default function useGlobalAssistant() {
  const [conversationsList, setConversationsList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessagesMap, setChatMessagesMap] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [responsePhase, setResponsePhase] = useState(null);
  const [scopeFilter, setScopeFilter] = useState("all"); // "all" | "7days" | "30days"

  // Ref to track active request by conversation ID to prevent duplicate requests
  const pendingRequestsRef = useRef(new Set());
  const isMountedRef = useRef(true);
  const isAbortedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Compute grouped conversations from real timestamps
  const chatGroups = useMemo(() => {
    return groupConversationsByDate(conversationsList);
  }, [conversationsList]);

  // Active chat metadata
  const activeChatMeta = useMemo(() => {
    return (
      conversationsList.find(
        (c) => (c._id || c.id) === activeChatId
      ) || null
    );
  }, [activeChatId, conversationsList]);

  // Active chat with its messages
  const activeChat = useMemo(() => {
    if (!activeChatMeta && !activeChatId) return null;
    const messages = chatMessagesMap[activeChatId] || [];
    return {
      id: activeChatId,
      _id: activeChatId,
      title: activeChatMeta?.title || "New conversation",
      messages,
      lastMessageAt: activeChatMeta?.lastMessageAt,
      createdAt: activeChatMeta?.createdAt,
    };
  }, [activeChatId, activeChatMeta, chatMessagesMap]);

  // Load conversation messages helper
  const loadConversationMessages = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const fullConv = await getConversationById(id);
        if (!isMountedRef.current) return;

        setChatMessagesMap((prev) => ({
          ...prev,
          [id]: (fullConv.messages || []).map((msg) => ({
            id: msg._id || crypto.randomUUID(),
            _id: msg._id,
            role: msg.role,
            content: msg.content,
            sources: msg.sources || [],
            createdAt: msg.createdAt,
          })),
        }));
      } catch (error) {
        console.error("Failed to load conversation messages:", error);
      }
    },
    []
  );

  // Fetch conversations from MongoDB with localStorage restore
  const fetchHistory = useCallback(async () => {
    setIsInitialLoading(true);
    setHistoryError(null);

    try {
      const data = await getConversations(1, 50);
      if (!isMountedRef.current) return;

      const list = data?.conversations || [];
      setConversationsList(list);

      if (list.length > 0) {
        // Attempt to restore previously active conversation from localStorage
        let savedChatId = null;
        try {
          savedChatId = localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);
        } catch (_) {}

        const matchedChat = list.find((c) => (c._id || c.id) === savedChatId);
        const targetId = matchedChat
          ? (matchedChat._id || matchedChat.id)
          : list[0]._id;

        setActiveChatId(targetId);
        try {
          localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, targetId);
        } catch (_) {}

        await loadConversationMessages(targetId);
      } else {
        setActiveChatId(null);
        try {
          localStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
        } catch (_) {}
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      if (!isMountedRef.current) return;
      setHistoryError(
        error.message || "Failed to load chat history. Please try again."
      );
    } finally {
      if (isMountedRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, [loadConversationMessages]);

  // Initial load on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handler for selecting an existing chat
  const handleSelectChat = useCallback(
    async (id) => {
      if (id === activeChatId) return;
      setActiveChatId(id);

      try {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, id);
      } catch (_) {}

      // If we don't have messages cached for this chat yet, fetch them
      if (!chatMessagesMap[id]) {
        await loadConversationMessages(id);
      }
    },
    [activeChatId, chatMessagesMap, loadConversationMessages]
  );

  // Handler for creating a new conversation
  const handleNewChat = useCallback(async () => {
    if (isLoading) return;

    try {
      const newConv = await createConversation("New conversation");
      const newId = newConv._id;

      setConversationsList((prev) => [newConv, ...prev]);
      setChatMessagesMap((prev) => ({
        ...prev,
        [newId]: [],
      }));
      setActiveChatId(newId);
      try {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, newId);
      } catch (_) {}
      setInput("");
      return newId;
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  }, [isLoading]);

  // Handler for renaming a conversation
  const handleRenameChat = useCallback(
    async (conversationId, newTitle) => {
      const clean = (newTitle || "").trim();
      if (!conversationId || !clean) return;

      const prevList = [...conversationsList];

      // Optimistic update
      setConversationsList((prev) =>
        prev.map((c) =>
          (c._id || c.id) === conversationId ? { ...c, title: clean } : c
        )
      );

      try {
        await updateConversationTitleApi(conversationId, clean);
      } catch (err) {
        console.error("Failed to rename conversation:", err);
        setConversationsList(prevList);
        throw err;
      }
    },
    [conversationsList]
  );

  // Handler for deleting a conversation
  const handleDeleteChat = useCallback(
    async (conversationId) => {
      if (!conversationId) return;

      try {
        await deleteConversationApi(conversationId);

        setConversationsList((prev) =>
          prev.filter((c) => (c._id || c.id) !== conversationId)
        );

        setChatMessagesMap((prev) => {
          const next = { ...prev };
          delete next[conversationId];
          return next;
        });

        // If active chat was deleted, switch to the first remaining or null
        if (activeChatId === conversationId) {
          const remaining = conversationsList.filter(
            (c) => (c._id || c.id) !== conversationId
          );
          if (remaining.length > 0) {
            const nextId = remaining[0]._id || remaining[0].id;
            setActiveChatId(nextId);
            try {
              localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, nextId);
            } catch (_) {}
            loadConversationMessages(nextId);
          } else {
            setActiveChatId(null);
            try {
              localStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
            } catch (_) {}
          }
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        throw error;
      }
    },
    [activeChatId, conversationsList, loadConversationMessages]
  );

  // Stop generation handler
  const stopGeneration = useCallback(() => {
    isAbortedRef.current = true;
    setIsLoading(false);
    setResponsePhase(null);
  }, []);

  // Handler for sending a message
  const sendMessage = useCallback(
    async (prompt = input) => {
      const text = prompt.trim();
      if (!text || isLoading) return;

      isAbortedRef.current = false;
      let targetChatId = activeChatId;

      // If no active chat exists, create one first in MongoDB
      if (!targetChatId) {
        try {
          const newConv = await createConversation("New conversation");
          targetChatId = newConv._id;
          setConversationsList((prev) => [newConv, ...prev]);
          setChatMessagesMap((prev) => ({
            ...prev,
            [targetChatId]: [],
          }));
          setActiveChatId(targetChatId);
          try {
            localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, targetChatId);
          } catch (_) {}
        } catch (createErr) {
          console.error("Failed to create conversation for message:", createErr);
          return;
        }
      }

      // Prevent concurrent message requests for the same conversation
      if (pendingRequestsRef.current.has(targetChatId)) return;
      pendingRequestsRef.current.add(targetChatId);

      // Optimistic user message
      const tempUserMsgId = `temp-${Date.now()}`;
      const userMessage = {
        id: tempUserMsgId,
        role: "user",
        content: text,
        createdAt: new Date(),
      };

      // Add user message to target conversation messages
      setChatMessagesMap((prev) => ({
        ...prev,
        [targetChatId]: [...(prev[targetChatId] || []), userMessage],
      }));

      // Update sidebar title optimistically if first message
      setConversationsList((prev) =>
        prev.map((c) => {
          const convId = c._id || c.id;
          if (convId === targetChatId) {
            const currentTitle = c.title || "New conversation";
            return {
              ...c,
              title:
                currentTitle === "New conversation"
                  ? text.slice(0, 36)
                  : currentTitle,
              lastMessageAt: new Date(),
            };
          }
          return c;
        })
      );

      setInput("");
      setIsLoading(true);
      setResponsePhase("searching");

      try {
        const responseData = await sendConversationMessage(targetChatId, text);
        if (isAbortedRef.current) return;

        const { assistantMessage, conversation: updatedConv } =
          responseData || {};

        // Replace optimistic user message with server user message ID
        if (responseData?.userMessage?._id) {
          setChatMessagesMap((prev) => ({
            ...prev,
            [targetChatId]: (prev[targetChatId] || []).map((m) =>
              m.id === tempUserMsgId
                ? {
                    ...m,
                    id: responseData.userMessage._id,
                    _id: responseData.userMessage._id,
                  }
                : m
            ),
          }));
        }

        // Update conversation metadata if title updated
        if (updatedConv?.title) {
          setConversationsList((prev) =>
            prev.map((c) =>
              (c._id || c.id) === targetChatId
                ? {
                    ...c,
                    title: updatedConv.title,
                    lastMessageAt: updatedConv.lastMessageAt || new Date(),
                  }
                : c
            )
          );
        }

        // Prepare simulated assistant response streaming
        const fullAnswer = assistantMessage?.content || "";
        const assistantMsgId =
          assistantMessage?._id || `assistant-${Date.now()}`;
        const newAssistantMsg = {
          id: assistantMsgId,
          _id: assistantMessage?._id,
          role: "assistant",
          content: "",
          sources: assistantMessage?.sources || responseData?.sources || [],
          createdAt: assistantMessage?.createdAt || new Date(),
        };

        // Append empty assistant message to target chat
        setChatMessagesMap((prev) => ({
          ...prev,
          [targetChatId]: [...(prev[targetChatId] || []), newAssistantMsg],
        }));

        setResponsePhase("streaming");

        // Simulate streaming chunks
        for (let idx = 1; idx <= fullAnswer.length; idx += 3) {
          if (!isMountedRef.current || isAbortedRef.current) break;
          await new Promise((resolve) => window.setTimeout(resolve, 8));

          const streamedContent = fullAnswer.slice(0, idx);

          // Always target targetChatId specifically to avoid race condition when user switches chats!
          setChatMessagesMap((prev) => ({
            ...prev,
            [targetChatId]: (prev[targetChatId] || []).map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: streamedContent }
                : msg
            ),
          }));
        }

        // Ensure full content is set at the end if not aborted
        if (isMountedRef.current && !isAbortedRef.current) {
          setChatMessagesMap((prev) => ({
            ...prev,
            [targetChatId]: (prev[targetChatId] || []).map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: fullAnswer }
                : msg
            ),
          }));
        }
      } catch (error) {
        console.error("Global Assistant send error:", error);

        if (isMountedRef.current && !isAbortedRef.current) {
          const errorMsg = {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              error.message ||
              "Unable to get a response from MeetMind AI. Please try again.",
            createdAt: new Date(),
          };

          setChatMessagesMap((prev) => ({
            ...prev,
            [targetChatId]: [...(prev[targetChatId] || []), errorMsg],
          }));
        }
      } finally {
        pendingRequestsRef.current.delete(targetChatId);
        if (isMountedRef.current) {
          setResponsePhase(null);
          setIsLoading(false);
        }
      }
    },
    [activeChatId, input, isLoading]
  );

  return {
    activeChat,
    activeChatId,
    chatGroups,
    createConversation: handleNewChat,
    deleteConversation: handleDeleteChat,
    renameConversation: handleRenameChat,
    stopGeneration,
    input,
    isLoading,
    isInitialLoading,
    historyError,
    retryFetchHistory: fetchHistory,
    responsePhase,
    messages: activeChat?.messages || [],
    sendMessage,
    setActiveChatId: handleSelectChat,
    setInput,
    scopeFilter,
    setScopeFilter,
  };
}
