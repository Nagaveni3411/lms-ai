import { useMemo, useState } from "react";

function getBotReply(input) {
  const text = input.toLowerCase();
  if (text.includes("login")) return "Use your registered email/password. If it fails, try Register first and then login.";
  if (text.includes("subject") || text.includes("course")) return "Go to Home and choose a subject card. The first unlocked video opens first.";
  if (text.includes("locked")) return "Videos unlock in order. Complete the previous video to unlock the next one.";
  if (text.includes("progress") || text.includes("resume")) return "Your watch time saves every few seconds and resumes from last position.";
  if (text.includes("error") || text.includes("failed")) return "Try refresh first. If issue continues, logout/login and check backend deployment status.";
  return "I can help with login, course navigation, locked videos, and progress tracking.";
}

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, I am your LMS AI assistant. Ask me anything about this platform." }
  ]);

  const quickPrompts = useMemo(
    () => ["How do I start a subject?", "Why is video locked?", "How does progress save?"],
    []
  );

  const send = (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    const reply = getBotReply(text);
    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="brand-gradient flex items-center justify-between px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-100">AI Assistant</p>
              <h3 className="text-sm font-semibold">LMS Helper</h3>
            </div>
            <button className="rounded-md px-2 py-1 text-xs hover:bg-white/10" onClick={() => setOpen(false)}>Close</button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-[#0a4dcf] text-white" : "bg-white text-slate-700 border border-slate-200"}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-200 p-3">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  onClick={() => send(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Ask about LMS..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <button className="rounded-md bg-[#0a4dcf] px-3 py-2 text-sm font-semibold text-white hover:bg-[#083da5]" onClick={() => send()}>
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="brand-gradient rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl hover:opacity-95"
          onClick={() => setOpen(true)}
        >
          AI Chat
        </button>
      )}
    </div>
  );
}
