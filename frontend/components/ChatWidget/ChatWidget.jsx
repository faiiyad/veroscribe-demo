"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../lib/api";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const INITIAL_SYMPTOM =
  "Hi! I'm your health assistant. What symptom are you experiencing today?";
// ─────────────────────────────────────────────────────────────────────────────

function useChat() {
  const [messages, setMessages] = useState([]);
  const [symptom] = useState(INITIAL_SYMPTOM);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("chat_messages");
      setMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("chat_messages", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem("chat_messages");
    } catch {}
  };

  return { messages, setMessages, symptom, clearChat };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, symptom, clearChat } = useChat();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage({
        symptom,
        prompt: text,
        history: updatedMessages.slice(0, -1),
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const allMessages = [
    { role: "assistant", content: symptom, isSymptom: true },
    ...messages,
  ];

  const assistantCount = messages.filter((m) => m.role === "assistant").length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chat popup */}
      <div
        className={[
          "fixed bottom-[84px] right-5 z-[9999]",
          "w-[340px] h-[480px]",
          "bg-white rounded-[20px]",
          "shadow-[0_8px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.08)]",
          "flex flex-col overflow-hidden",
          "transition-all duration-200 ease-out",
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-3 bg-[#f7f7f7] border-b border-[#e5e5ea] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#007aff] to-[#34aadc] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1c1e] leading-tight">
                Health Assistant
              </p>
              <p className="text-[11px] text-[#8e8e93] leading-tight">
                {loading ? "Typing…" : "Online"}
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-[#8e8e93] hover:text-[#1c1c1e] hover:bg-[#e5e5ea] px-2 py-1.5 rounded-lg transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
            </svg>
            New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-1">
          {allMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "max-w-[75%] px-3.5 py-2 text-sm leading-snug break-words",
                  msg.role === "user"
                    ? "bg-[#007aff] text-white rounded-[18px] rounded-br-[5px]"
                    : "bg-[#e5e5ea] text-[#1c1c1e] rounded-[18px] rounded-bl-[5px]",
                ].join(" ")}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#e5e5ea] rounded-[18px] rounded-bl-[5px] px-3.5 py-3 flex items-center gap-1">
                <span className="w-[7px] h-[7px] rounded-full bg-[#8e8e93] animate-bounce [animation-delay:0ms]" />
                <span className="w-[7px] h-[7px] rounded-full bg-[#8e8e93] animate-bounce [animation-delay:150ms]" />
                <span className="w-[7px] h-[7px] rounded-full bg-[#8e8e93] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 px-3 py-2.5 border-t border-[#e5e5ea] bg-white shrink-0"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message…"
            disabled={loading}
            className="flex-1 bg-[#f7f7f7] border border-[#e5e5ea] rounded-full px-4 py-2 text-sm text-[#1c1c1e] placeholder:text-[#8e8e93] outline-none focus:border-[#007aff] transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#007aff] flex items-center justify-center shrink-0 hover:bg-[#0066d6] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat"
        className={[
          "fixed bottom-5 right-5 z-[10000]",
          "w-[52px] h-[52px] rounded-full",
          "flex items-center justify-center",
          "transition-all duration-200 active:scale-95",
          open
            ? "bg-[#8e8e93] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            : "bg-gradient-to-br from-[#007aff] to-[#34aadc] shadow-[0_4px_16px_rgba(0,122,255,0.4)]",
        ].join(" ")}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}

        {/* Unread badge */}
        {!open && assistantCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#ff3b30] text-white text-[10px] font-bold flex items-center justify-center">
            {assistantCount}
          </span>
        )}
      </button>
    </>
  );
}