"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  getConversationById,
  streamConversationMessageApi,
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
  const abortControllerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Compute grouped conversations from real timestamps
  const chatGroups = useMemo(() => {
    return groupConversationsByDate(conversationsList);
  }, [conversationsList]);

  // Active conversation object computed from state
  const activeChat = useMemo(() => {
    if (!activeChatId) return null;
    const conversationMeta = conversationsList.find(
      (c) => (c._id || c.id) === activeChatId
    );
    const messages = chatMessagesMap[activeChatId] || [];

    return {
      id: activeChatId,
      _id: activeChatId,
      title: conversationMeta?.title || "New conversation",
      messages,
      lastMessageAt: conversationMeta?.lastMessageAt,
      createdAt: conversationMeta?.createdAt,
    };
  }, [activeChatId, conversationsList, chatMessagesMap]);

  // Load messages for a given conversation from MongoDB if not already loaded
  const loadConversationMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) return;

      try {
        const fullConv = await getConversationById(conversationId);
        if (!isMountedRef.current) return;

        setChatMessagesMap((prev) => ({
          ...prev,
          [conversationId]: (fullConv.messages || []).map((msg) => ({
            id: msg._id,
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

  // Initial load on mount using async function inside effect (strict React 19 pattern)
  useEffect(() => {
    let ignore = false;

    async function loadInitialHistory() {
      try {
        const data = await getConversations(1, 50);
        if (ignore || !isMountedRef.current) return;

        const list = data?.conversations || [];
        setConversationsList(list);

        if (list.length > 0) {
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
        if (!ignore && isMountedRef.current) {
          console.error("Failed to load conversation history:", error);
          setHistoryError(
            error.message || "Failed to load chat history. Please try again."
          );
        }
      } finally {
        if (!ignore && isMountedRef.current) {
          setIsInitialLoading(false);
        }
      }
    }

    loadInitialHistory();

    return () => {
      ignore = true;
    };
  }, [loadConversationMessages]);

  // Retry handler for history loading errors
  const retryFetchHistory = useCallback(async () => {
    setIsInitialLoading(true);
    setHistoryError(null);

    try {
      const data = await getConversations(1, 50);
      if (!isMountedRef.current) return;

      const list = data?.conversations || [];
      setConversationsList(list);

      if (list.length > 0) {
        const targetId = list[0]._id;
        setActiveChatId(targetId);
        try {
          localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, targetId);
        } catch (_) {}
        await loadConversationMessages(targetId);
      } else {
        setActiveChatId(null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setHistoryError(
          error.message || "Failed to load chat history. Please try again."
        );
      }
    } finally {
      if (isMountedRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, [loadConversationMessages]);

  // Handler for selecting an existing chat
  const handleSelectChat = useCallback(
    async (conversationId) => {
      if (conversationId === activeChatId) return;

      setActiveChatId(conversationId);
      try {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, conversationId);
      } catch (_) {}

      // Fetch full messages if not already in memory
      if (!chatMessagesMap[conversationId]) {
        await loadConversationMessages(conversationId);
      }
    },
    [activeChatId, chatMessagesMap, loadConversationMessages]
  );

  // Handler for creating a new conversation
  const handleNewChat = useCallback(async () => {
    try {
      const newConv = await createConversation("New conversation");
      setConversationsList((prev) => [newConv, ...prev]);
      setChatMessagesMap((prev) => ({
        ...prev,
        [newConv._id]: [],
      }));
      setActiveChatId(newConv._id);
      try {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, newConv._id);
      } catch (_) {}
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  }, []);

  // Handler for renaming a conversation title
  const handleRenameChat = useCallback(
    async (conversationId, newTitle) => {
      if (!newTitle || !newTitle.trim()) return;

      try {
        const updated = await updateConversationTitleApi(
          conversationId,
          newTitle.trim()
        );

        setConversationsList((prev) =>
          prev.map((c) =>
            (c._id || c.id) === conversationId
              ? { ...c, title: updated.title }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to rename conversation:", error);
        throw error;
      }
    },
    []
  );

  // Handler for deleting a conversation
  const handleDeleteChat = useCallback(
    async (conversationId) => {
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

  // Stop generation handler with AbortController
  const stopGeneration = useCallback(() => {
    isAbortedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setResponsePhase(null);

    if (activeChatId) {
      setChatMessagesMap((prev) => {
        const msgs = prev[activeChatId] || [];
        const lastMsg = msgs[msgs.length - 1];
        if (
          lastMsg &&
          lastMsg.role === "assistant" &&
          !lastMsg.content?.trim()
        ) {
          return {
            ...prev,
            [activeChatId]: msgs.slice(0, -1),
          };
        }
        return prev;
      });
    }
  }, [activeChatId]);

  // Handler for sending a message with real-time SSE streaming
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

      // Placeholder assistant message ready for streaming tokens
      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderAssistantMsg = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        sources: [],
        createdAt: new Date(),
      };

      setChatMessagesMap((prev) => ({
        ...prev,
        [targetChatId]: [...(prev[targetChatId] || []), placeholderAssistantMsg],
      }));

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await streamConversationMessageApi({
          conversationId: targetChatId,
          message: text,
          signal: controller.signal,
          onMetadata: (metadata) => {
            if (metadata?.userMessage?._id) {
              setChatMessagesMap((prev) => ({
                ...prev,
                [targetChatId]: (prev[targetChatId] || []).map((m) =>
                  m.id === tempUserMsgId
                    ? {
                        ...m,
                        id: metadata.userMessage._id,
                        _id: metadata.userMessage._id,
                      }
                    : m
                ),
              }));
            }
          },
          onToken: (tokenData) => {
            if (isAbortedRef.current) return;
            setResponsePhase("streaming");
            const fullText = tokenData?.text ?? tokenData?.delta ?? "";

            setChatMessagesMap((prev) => ({
              ...prev,
              [targetChatId]: (prev[targetChatId] || []).map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: fullText }
                  : msg
              ),
            }));
          },
          onSources: (sourcesData) => {
            const verifiedSources = sourcesData?.sources || [];
            setChatMessagesMap((prev) => ({
              ...prev,
              [targetChatId]: (prev[targetChatId] || []).map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, sources: verifiedSources }
                  : msg
              ),
            }));
          },
          onDone: (doneData) => {
            const { assistantMessage, conversation: updatedConv } = doneData || {};

            if (assistantMessage?._id) {
              setChatMessagesMap((prev) => ({
                ...prev,
                [targetChatId]: (prev[targetChatId] || []).map((msg) =>
                  msg.id === assistantMsgId
                    ? {
                        ...msg,
                        id: assistantMessage._id,
                        _id: assistantMessage._id,
                        content: assistantMessage.content || msg.content,
                        sources: assistantMessage.sources || msg.sources,
                      }
                    : msg
                ),
              }));
            }

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
          },
        });
      } catch (error) {
        if (controller.signal.aborted || isAbortedRef.current) {
          return;
        }

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
            [targetChatId]: (prev[targetChatId] || []).map((msg) =>
              msg.id === assistantMsgId ? errorMsg : msg
            ),
          }));
        }
      } finally {
        pendingRequestsRef.current.delete(targetChatId);
        abortControllerRef.current = null;
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
    retryFetchHistory,
    responsePhase,
    messages: activeChat?.messages || [],
    sendMessage,
    setActiveChatId: handleSelectChat,
    setInput,
    scopeFilter,
    setScopeFilter,
  };
}
