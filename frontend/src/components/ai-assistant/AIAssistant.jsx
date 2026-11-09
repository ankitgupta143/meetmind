"use client";

import useAssistantChat from "./hooks/useAssistantChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import EmptyConversation from "./EmptyConversation";
import PromptSuggestions from "./PromptSuggestions";

export default function AIAssistant({ meetingId }) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearConversation,
    regenerateResponse,
  } = useAssistantChat(meetingId);

  return (
    <div className="flex h-[clamp(580px,calc(100vh-260px),780px)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <ChatHeader onNewChat={clearConversation} />

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-4 py-4 sm:px-8">
          <EmptyConversation />
          <PromptSuggestions onSuggestionClick={sendMessage} />
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
