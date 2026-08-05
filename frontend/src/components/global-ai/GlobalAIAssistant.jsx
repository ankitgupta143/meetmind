"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, ChevronDown, Clock3, Menu, Plus } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GLOBAL_ASSISTANT_PROMPTS } from "./data/assistantData";
import useGlobalAssistant from "./hooks/useGlobalAssistant";
import Sidebar from "./Sidebar";

export default function GlobalAIAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const {
    activeChatId,
    chatGroups,
    createConversation,
    input,
    isLoading,
    messages,
    responsePhase,
    sendMessage,
    setActiveChatId,
    setInput,
  } = useGlobalAssistant();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isLoading, messages]);

  const startChat = () => {
    createConversation();
    setSidebarOpen(false);
  };

  const history = (
    <Sidebar
      activeChatId={activeChatId}
      chatGroups={chatGroups}
      onClose={() => setSidebarOpen(false)}
      onNewChat={startChat}
      onSelect={(id) => {
        setActiveChatId(id);
        setSidebarOpen(false);
      }}
    />
  );

  return (
    <div className="relative h-[calc(100vh-176px)] min-h-[620px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex h-full">
        <div className="hidden lg:flex">{history}</div>
        {sidebarOpen && (
          <div className="absolute inset-0 z-20 flex bg-zinc-950/20 lg:hidden">
            <div className="h-full shadow-xl">{history}</div>
            <button
              aria-label="Close sidebar"
              className="flex-1"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="font-semibold text-zinc-950">
                  Global AI Assistant
                </h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Ask anything across all your meetings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 sm:flex">
                <Clock3 size={14} /> All meetings <ChevronDown size={14} />
              </button>
              <button
                onClick={startChat}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </header>
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-10 sm:px-10">
              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                  <Bot size={27} />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  Your meeting workspace, at a glance.
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
                  Ask MeetMind to connect the dots across every conversation,
                  decision, and action item.
                </p>
                <div className="mt-9 grid gap-3 sm:grid-cols-2">
                  {GLOBAL_ASSISTANT_PROMPTS.map(
                    ({ icon: Icon, title, subtitle }) => (
                      <button
                        key={title}
                        onClick={() => sendMessage(title)}
                        className="group rounded-xl border border-zinc-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-800">{title}</p>
                            <p className="mt-1 text-sm text-zinc-500">
                              {subtitle}
                            </p>
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-10">
              <div className="mx-auto max-w-3xl space-y-7">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.role === "user" ? "order-2 bg-zinc-900 text-white" : "bg-indigo-600 text-white"}`}
                    >
                      {message.role === "user" ? (
                        <span className="text-xs font-semibold">You</span>
                      ) : (
                        <Bot size={17} />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "order-1 rounded-tr-sm bg-zinc-900 text-white" : "rounded-tl-sm border border-zinc-200 bg-white text-zinc-700"}`}
                    >
                      {message.role === "user" ? (
                        message.content
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                {responsePhase === "searching" && (
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Bot size={17} />
                    </div>
                    <span>Searching your meeting workspace</span>
                    <span className="flex gap-1" aria-label="Searching">
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                )}
                {responsePhase === "streaming" && (
                  <p className="-mt-4 pl-11 text-xs font-medium text-indigo-600">Streaming…</p>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
          <div className="border-t border-zinc-200 bg-white px-5 py-4 sm:px-7">
            <div className="mx-auto flex max-w-3xl items-end rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-indigo-400">
              <TextareaAutosize
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                maxRows={5}
                placeholder="Ask about all your meetings..."
                className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1 text-sm outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white disabled:bg-zinc-200"
              >
                <ArrowUp size={17} />
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-zinc-400">
              MeetMind may make mistakes. Check important information in the
              source meeting.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
