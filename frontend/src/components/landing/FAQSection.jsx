"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "./data/faq";

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-3/4 max-w-2xl bg-indigo-600/10 blur-[130px]" />

      <div className="relative text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
          Frequently asked questions
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            know
          </span>
          .
        </h2>
      </div>

      <div className="relative mt-12 space-y-4">
        {faq.map((item, index) => {
          const isOpen = open === index;
          return (
            <div
              key={item.question}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                isOpen
                  ? "border-indigo-500/40 bg-slate-900/80 shadow-lg shadow-indigo-600/10"
                  : "border-white/[0.08] bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/60"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-semibold text-sm sm:text-base text-white"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`size-5 text-slate-400 transition-transform duration-300 shrink-0 ml-3 ${
                    isOpen ? "rotate-180 text-cyan-300" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-slate-300 border-t border-white/[0.04]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

