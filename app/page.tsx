import ChatWindow from "@/components/ChatWindow";
import CalculatorsPanel from "@/components/CalculatorsPanel";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          עוזר מחקר וניתוח — מיסוי יחיד ושכר
        </h1>
        <p className="text-slate-600">
          כלי פנימי עבור אילן גרמן, יועץ מס: בדיקת תיקים, בירור דין, הצלבת
          מסמכים וניסוח פניות מקצועיות. לא תחליף לשיקול דעת מקצועי.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChatWindow />
        <CalculatorsPanel />
      </div>

      <footer className="text-xs text-slate-400 text-center pt-4 pb-8">
        כלי מחקר פנימי בלבד. אינו מחליף בדיקת מקורות, שיקול דעת מקצועי
        או אחריות מקצועית. ההחלטה בכל תיק נשארת אצל יועץ המס. ראו{" "}
        <code>docs/agent-brief.md</code> למדיניות המקורות ולתוכנית ההקמה
        המלאה.
      </footer>
    </main>
  );
}
