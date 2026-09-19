import ChatWindow from "@/components/ChatWindow";
import CalculatorsPanel from "@/components/CalculatorsPanel";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          יועץ AI למיסוי יחיד ושכר
        </h1>
        <p className="text-slate-600">
          מס הכנסה, ביטוח לאומי, מע"מ, דיני עבודה, מילואים, לידה, פיטורים
          ועוד — צ'אט מומחה + מחשבונים מהירים.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChatWindow />
        <CalculatorsPanel />
      </div>

      <footer className="text-xs text-slate-400 text-center pt-4 pb-8">
        המידע באתר זה הוא כללי ואינו מהווה ייעוץ מס/משפטי פרטני. יש לאמת
        נתונים מספריים מול המקורות הרשמיים (רשות המסים, המוסד לביטוח
        לאומי) ולהיוועץ ברואה חשבון/יועץ מס מוסמך לפני קבלת החלטות.
      </footer>
    </main>
  );
}
