"use client";

import { useMemo, useState } from "react";
import { calcReserveDutyDaily } from "@/lib/calculators";
import { DATA_AS_OF } from "@/lib/taxRates";

function ils(n: number) {
  return n.toLocaleString("he-IL", { maximumFractionDigits: 0 }) + " ₪";
}

export default function ReserveDutyCalculator() {
  const [avgIncome, setAvgIncome] = useState(16000);
  const [days, setDays] = useState(7);

  const result = useMemo(
    () => calcReserveDutyDaily(avgIncome, days),
    [avgIncome, days]
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-slate-800">
        הערכת תגמול מילואים
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
        <label className="text-sm text-slate-600">
          הכנסה מבוטחת חודשית ממוצעת
          <input
            type="number"
            value={avgIncome}
            onChange={(e) => setAvgIncome(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          מספר ימי מילואים
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-slate-500">תגמום יומי משוער</div>
          <div className="font-semibold">{ils(result.dailyPay)}</div>
        </div>
        <div>
          <div className="text-slate-500">סה"כ לתקופת השירות</div>
          <div className="font-bold text-brand-700">{ils(result.totalPay)}</div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        בפועל, שכיר ממשיך לקבל שכר מהמעסיק כרגיל, והמעסיק הוא שמגיש תביעה
        לביטוח הלאומי להחזר. עצמאי מגיש תביעה בעצמו. יש לוודא הגשת התביעה
        במועד הקבוע.
      </p>

      <p className="text-xs text-amber-600">
        ⚠️ הערכה בלבד, על בסיס תקרת הכנסה יומית לדוגמה ({DATA_AS_OF}). התגמום
        בפועל מחושב על ידי הביטוח הלאומי לפי כללי בסיס השכר הרלוונטיים.
      </p>
    </div>
  );
}
