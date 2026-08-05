"use client";

import useAssistantChat from "./hooks/useAssistantChat";

import ChatHeader from "./ChatHeader";

import ChatInput from "./ChatInput";

import ChatMessages from "./ChatMessages";

import EmptyConversation from "./EmptyConversation";

import PromptSuggestions from "./PromptSuggestions";

export default function AIAssistant() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearConversation,
    regenerateResponse,
  } = useAssistantChat();

  return (
    <div className="flex h-[calc(100vh-240px)] min-h-[700px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <ChatHeader onNewChat={clearConversation} />

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center px-8">
          <EmptyConversation />

          <PromptSuggestions
            onSuggestionClick={sendMessage}
          />
        </div>
      ) : (
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onRegenerate={regenerateResponse}
        />
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => sendMessage()}
        isLoading={isLoading}
      />
    </div>
  );
}