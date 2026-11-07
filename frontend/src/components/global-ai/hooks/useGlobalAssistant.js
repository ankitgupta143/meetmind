"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  getConversationById,
  sendConversationMessage,
  deleteConversation as deleteConversationApi,
} from "../services/globalAssistantService";
import { groupConversationsByDate } from "../data/assistantData";

export default function useGlobalAssistant() {
  const [conversationsList, setConversationsList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessagesMap, setChatMessagesMap] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [responsePhase, setResponsePhase] = useState(null);

  // Ref to track active request by conversation ID to prevent duplicate requests
  const pendingRequestsRef = useRef(new Set());
  const isMountedRef = useRef(true);

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
            createdAt: msg.createdAt,
          })),
        }));
      } catch (error) {
        console.error("Failed to load conversation messages:", error);
      }
    },
    []
  );

  // Initial load: Fetch conversation history from MongoDB
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      setIsInitialLoading(true);
      try {
        const data = await getConversations(1, 50);
        if (isCancelled || !isMountedRef.current) return;

        const list = data?.conversations || [];
        setConversationsList(list);

        if (list.length > 0) {
          const firstId = list[0]._id;
          setActiveChatId(firstId);
          await loadConversationMessages(firstId);
        } else {
          setActiveChatId(null);
        }
      } catch (error) {
        console.error("Failed to load initial conversations:", error);
      } finally {
        if (!isCancelled && isMountedRef.current) {
          setIsInitialLoading(false);
        }
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, [loadConversationMessages]);

  // Handler for selecting an existing chat
  const handleSelectChat = useCallback(
    async (id) => {
      if (id === activeChatId) return;
      setActiveChatId(id);

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
      setInput("");
      return newId;
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  }, [isLoading]);

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
            loadConversationMessages(nextId);
          } else {
            setActiveChatId(null);
          }
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        throw error;
      }
    },
    [activeChatId, conversationsList, loadConversationMessages]
  );

  // Handler for sending a message
  const sendMessage = useCallback(
    async (prompt = input) => {
      const text = prompt.trim();
      if (!text || isLoading) return;

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
          if (!isMountedRef.current) break;
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

        // Ensure full content is set at the end
        if (isMountedRef.current) {
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

        if (isMountedRef.current) {
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
    input,
    isLoading,
    isInitialLoading,
    responsePhase,
    messages: activeChat?.messages || [],
    sendMessage,
    setActiveChatId: handleSelectChat,
    setInput,
  };
}
