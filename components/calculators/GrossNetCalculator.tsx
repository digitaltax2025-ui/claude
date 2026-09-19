"use client";

import { useMemo, useState } from "react";
import { calcGrossToNet, calcEmployerCostRange } from "@/lib/calculators";
import { DATA_AS_OF } from "@/lib/taxRates";

function ils(n: number) {
  return n.toLocaleString("he-IL", { maximumFractionDigits: 0 }) + " ₪";
}

export default function GrossNetCalculator() {
  const [gross, setGross] = useState(15000);
  const [creditPoints, setCreditPoints] = useState(2.25);
  const [kind, setKind] = useState<"employee" | "selfEmployed">("employee");

  const result = useMemo(
    () => calcGrossToNet(gross, creditPoints, kind),
    [gross, creditPoints, kind]
  );
  const employerCost = useMemo(() => calcEmployerCostRange(gross), [gross]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-slate-800">מחשבון ברוטו → נטו</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-sm text-slate-600">
          שכר ברוטו חודשי
          <input
            type="number"
            value={gross}
            onChange={(e) => setGross(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-600">
          נקודות זיכוי
          <input
            type="number"
            step="0.25"
            value={creditPoints}
            onChange={(e) => setCreditPoints(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm text-slate-600">
          סטטוס
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "employee" | "selfEmployed")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="employee">שכיר</option>
            <option value="selfEmployed">עצמאי</option>
          </select>
        </label>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <div className="text-slate-500">מס הכנסה</div>
          <div className="font-semibold">{ils(result.incomeTaxMonthly)}</div>
        </div>
        <div>
          <div className="text-slate-500">ביטוח לאומי</div>
          <div className="font-semibold">{ils(result.nationalInsuranceMonthly)}</div>
        </div>
        <div>
          <div className="text-slate-500">מס בריאות</div>
          <div className="font-semibold">{ils(result.healthTaxMonthly)}</div>
        </div>
        <div>
          <div className="text-slate-500">נטו משוער</div>
          <div className="font-bold text-brand-700">{ils(result.netMonthly)}</div>
        </div>
      </div>

      {kind === "employee" && (
        <p className="text-xs text-slate-500">
          עלות מעביד משוערת (כולל הפרשות פנסיה/פיצויים וני מעביד): בין{" "}
          {ils(employerCost.min)} ל-{ils(employerCost.max)} לחודש.
        </p>
      )}

      <p className="text-xs text-amber-600">
        ⚠️ חישוב הערכה בלבד, לפי טבלת מס לדוגמה ({DATA_AS_OF}). אין להסתמך על
        התוצאה כערך סופי — יש לאמת מול תלוש שכר/רו"ח או מחשבון רשמי של רשות
        המסים.
      </p>
    </div>
  );
}
