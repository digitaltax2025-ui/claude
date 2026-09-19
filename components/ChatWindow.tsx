"use client";

import { useRef, useState, useEffect } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "כמה מס אשלם כעצמאי עם הכנסה חודשית של 20,000 ש״ח?",
  "יצאתי למילואים 14 יום — מה מגיע לי ולמעסיק שלי?",
  "אני בהיריון בחודש שביעי — אילו זכויות מגיעות לי בעבודה?",
  "התפטרתי אחרי 4 שנים — מה כולל גמר החשבון שלי?",
  "כדאי לי לעבור משכיר לעצמאי? איך משווים נכון?",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (res.status === 501) {
        setConfigured(false);
        const body = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: body.error },
        ]);
        setLoading(false);
        return;
      }

      if (!res.body) throw new Error("אין תגובה מהשרת");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `אירעה שגיאה: ${
            err instanceof Error ? err.message : "שגיאה לא ידועה"
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-8 space-y-4">
            <p className="text-lg font-medium text-slate-700">
              שלום! אני יועץ AI למיסוי יחיד ושכר. במה אפשר לעזור?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-sm bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full transition"
                >
                  {s}
                </button>
              ))}
            </div>
            {!configured && (
              <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3 max-w-md mx-auto">
                לתשומת לבך: מפתח ה-API עדיין לא הוגדר בסביבה זו. ראו README
                להגדרת ANTHROPIC_API_KEY.
              </p>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-600 text-white rounded-bl-sm"
                  : "bg-slate-100 text-slate-800 rounded-br-sm"
              }`}
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-slate-200 p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="שאל/י שאלה בנושא מיסים, ביטוח לאומי, שכר או זכויות עבודה..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          שליחה
        </button>
      </form>
    </div>
  );
}
