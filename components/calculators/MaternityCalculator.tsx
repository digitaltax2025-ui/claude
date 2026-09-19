"use client";

import { useMemo, useState } from "react";
import { calcMaternityDailyAllowance } from "@/lib/calculators";
import { DATA_AS_OF } from "@/lib/taxRates";

function ils(n: number) {
  return n.toLocaleString("he-IL", { maximumFractionDigits: 0 }) + " ₪";
}

export default function MaternityCalculator() {
  const [avgIncome, setAvgIncome] = useState(14000);

  const result = useMemo(
    () => calcMaternityDailyAllowance(avgIncome),
    [avgIncome]
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-slate-800">
        הערכת דמי לידה
      </h3>

      <label className="text-sm text-slate-600 block max-w-xs">
        הכנסה חודשית ממוצעת ב-3 החודשים שקדמו ללידה
        <input
          type="number"
          value={avgIncome}
          onChange={(e) => setAvgIncome(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-slate-500">דמי לידה יומיים משוערים</div>
          <div className="font-semibold">{ils(result.dailyAllowance)}</div>
        </div>
        <div>
          <div className="text-slate-500">סה"כ לתקופת התשלום המלא</div>
          <div className="font-bold text-brand-700">
            {ils(result.totalForFullPayPeriod)}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        הזכאות מותנית בתקופת אכשרה (חודשי עבודה/תשלום דמי ביטוח לפני הלידה),
        ומספר השבועות בתשלום מלא תלוי בוותק ובמספר הילדים. לפרטים ולתביעה
        בפועל יש לפנות למוסד לביטוח לאומי.
      </p>

      <p className="text-xs text-amber-600">
        ⚠️ הערכה בלבד, על בסיס תקרת הכנסה יומית לדוגמה ({DATA_AS_OF}). הסכום
        הסופי נקבע על ידי המוסד לביטוח לאומי בהתאם לנתונים המדויקים בתיק.
      </p>
    </div>
  );
}
