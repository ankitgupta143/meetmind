"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, ChevronDown, Clock3, Menu, Plus, Sparkles, User, Copy, Check } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GLOBAL_ASSISTANT_PROMPTS } from "./data/assistantData";
import useGlobalAssistant from "./hooks/useGlobalAssistant";
import Sidebar from "./Sidebar";
import MarkdownRenderer from "@/components/ai-assistant/MarkdownRenderer";

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
    <div className="relative h-[calc(100vh-176px)] min-h-[620px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-slate-950/60 shadow-2xl backdrop-blur-2xl">
      <div className="flex h-full">
        <div className="hidden lg:flex">{history}</div>
        {sidebarOpen && (
          <div className="absolute inset-0 z-40 flex bg-black/80 backdrop-blur-sm lg:hidden">
            <div className="h-full shadow-2xl">{history}</div>
            <button
              aria-label="Close sidebar"
              className="flex-1"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-2">
                  Global AI Intelligence
                  <Sparkles size={14} className="text-cyan-400" />
                </h1>
                <p className="text-xs text-slate-400">
                  Ask anything across all archived meetings & transcripts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 sm:flex">
                <Clock3 size={13} className="text-indigo-400" /> All workspace meetings <ChevronDown size={13} />
              </button>
              <button
                onClick={startChat}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                title="Start new conversation"
              >
                <Plus size={18} />
              </button>
            </div>
          </header>

          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-10">
              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-600/30">
                  <Bot size={28} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Your entire meeting memory, connected.
                </h2>
                <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-400">
                  Ask MeetMind to connect the dots across conversations, decisions, speaker sentiment, and cross-team commitments.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {GLOBAL_ASSISTANT_PROMPTS.map(
                    ({ icon: Icon, title, subtitle }) => (
                      <button
                        key={title}
                        onClick={() => sendMessage(title)}
                        className="group rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 text-left transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-white">{title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
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
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3.5 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${message.role === "user" ? "order-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400" : "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20"}`}
                    >
                      {message.role === "user" ? (
                        <User size={15} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${message.role === "user" ? "order-1 rounded-tr-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "rounded-tl-none border border-white/[0.08] bg-slate-900/80 text-slate-200"}`}
                    >
                      {message.role === "user" ? (
                        message.content
                      ) : (
                        <MarkdownRenderer content={message.content} />
                      )}
                    </div>
                  </div>
                ))}
                {responsePhase === "searching" && (
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Bot size={15} />
                    </div>
                    <span>Scanning transcript database</span>
                    <span className="flex gap-1" aria-label="Searching">
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                )}
                {responsePhase === "streaming" && (
                  <p className="-mt-4 pl-10 text-xs font-semibold text-indigo-400">Synthesizing insights…</p>
                )}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
          <div className="border-t border-white/[0.08] bg-slate-950/80 p-4 sm:px-7 sm:py-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-3xl items-end rounded-2xl border border-white/[0.08] bg-slate-900/90 px-3.5 py-2.5 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
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
                placeholder="Ask about discussions, decisions or deliverables across all meetings..."
                className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white disabled:opacity-40 shadow-md transition hover:scale-105"
              >
                <ArrowUp size={16} />
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-slate-500">
              MeetMind AI parses transcripts with semantic context. Verify mission-critical details with source recordings.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
