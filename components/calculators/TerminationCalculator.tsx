"use client";

import { useMemo, useState } from "react";
import { calcSeverancePay, calcRecoveryPay } from "@/lib/calculators";
import { DATA_AS_OF } from "@/lib/taxRates";

function ils(n: number) {
  return n.toLocaleString("he-IL", { maximumFractionDigits: 0 }) + " ₪";
}

export default function TerminationCalculator() {
  const [lastSalary, setLastSalary] = useState(15000);
  const [tenureYears, setTenureYears] = useState(3.5);
  const [reason, setReason] = useState<"dismissed" | "resigned">("dismissed");

  const severance = useMemo(
    () => calcSeverancePay(lastSalary, tenureYears),
    [lastSalary, tenureYears]
  );
  const recovery = useMemo(() => calcRecoveryPay(tenureYears), [tenureYears]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-slate-800">
        מחשבון גמר חשבון (פיטורים/התפטרות)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-sm text-slate-600">
          שכר אחרון (ברוטו)
          <input
            type="number"
            value={lastSalary}
            onChange={(e) => setLastSalary(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          ותק (שנים)
          <input
            type="number"
            step="0.25"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          סיבת סיום
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as "dismissed" | "resigned")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="dismissed">פיטורים</option>
            <option value="resigned">התפטרות</option>
          </select>
        </label>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-slate-500">
            פיצויי פיטורים {reason === "resigned" ? "(אם חל 'דין מפוטר')" : ""}
          </div>
          <div className="font-bold text-brand-700">{ils(severance)}</div>
        </div>
        <div>
          <div className="text-slate-500">
            דמי הבראה יחסיים ({recovery.days} ימים)
          </div>
          <div className="font-semibold">{ils(recovery.amount)}</div>
        </div>
      </div>

      {reason === "resigned" && (
        <p className="text-xs text-slate-600 bg-amber-50 rounded-lg p-3">
          בהתפטרות רגילה אין זכאות אוטומטית לפיצויי פיטורים, אלא אם מתקיים
          אחד מהחריגים ל"התפטרות בדין מפוטר" (הרעת תנאים מהותית, מעבר דירה,
          מצב בריאותי, טיפול בילד ועוד — ראו docs/system-prompt.md §5.8).
        </p>
      )}

      <p className="text-xs text-slate-500">
        גמר חשבון מלא כולל גם: פדיון חופשה שלא נוצלה, השלמת הפרשות פנסיוניות,
        ותשלום/ניכוי בגין הודעה מוקדמת — לא נכללים בחישוב זה.
      </p>

      <p className="text-xs text-amber-600">
        ⚠️ חישוב לפי נוסחת יסוד בלבד ({DATA_AS_OF}) — אינו מביא בחשבון הסכמי
        עבודה אישיים/קיבוציים, הפרשות לקופת גמל במקום פיצויים (סעיף 14), או
        תנאים ייחודיים אחרים.
      </p>
    </div>
  );
}
