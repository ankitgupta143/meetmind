"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }) {
  return (
    <div className="text-xs sm:text-sm leading-relaxed space-y-2.5 text-slate-200">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold text-white mt-3 mb-1.5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-indigo-300 mt-2 mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-xs font-bold text-slate-200 mt-2 mb-1">{children}</h4>,
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-200">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="my-0.5 leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-white tracking-wide">{children}</strong>,
          em: ({ children }) => <em className="italic text-indigo-200">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-r-lg text-slate-300 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 shadow-md">
              <table className="min-w-full divide-y divide-white/10 text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-900/90 text-slate-200 font-bold uppercase tracking-wider text-[11px]">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-white/[0.06] text-slate-300">{children}</tbody>,
          tr: ({ children }) => <tr className="transition-colors hover:bg-white/[0.03]">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-bold text-indigo-300">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2.5 text-slate-200">{children}</td>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="rounded-md border border-white/10 bg-slate-900/90 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">
                {children}
              </code>
            ) : (
              <pre className="my-2 overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3.5 font-mono text-xs text-cyan-300">
                <code>{children}</code>
              </pre>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
