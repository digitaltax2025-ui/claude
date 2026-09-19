"use client";

import { useMemo, useState } from "react";
import { calcGrossToNet } from "@/lib/calculators";
import { DATA_AS_OF } from "@/lib/taxRates";

function ils(n: number) {
  return n.toLocaleString("he-IL", { maximumFractionDigits: 0 }) + " ₪";
}

export default function EmployeeVsFreelancerCalculator() {
  const [employeeGross, setEmployeeGross] = useState(18000);
  const [freelancerRevenue, setFreelancerRevenue] = useState(22000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500);
  const [creditPoints, setCreditPoints] = useState(2.25);

  const employeeResult = useMemo(
    () => calcGrossToNet(employeeGross, creditPoints, "employee"),
    [employeeGross, creditPoints]
  );

  const freelancerTaxable = Math.max(0, freelancerRevenue - monthlyExpenses);
  const freelancerResult = useMemo(
    () => calcGrossToNet(freelancerTaxable, creditPoints, "selfEmployed"),
    [freelancerTaxable, creditPoints]
  );
  // עצמאי גם "מפסיד" את הוצאות המעביד לפנסיה/פיצויים — יש לחסוך זאת בעצמו
  const freelancerRecommendedPensionSaving = freelancerTaxable * 0.145;
  const freelancerNetAfterSelfPension =
    freelancerResult.netMonthly - freelancerRecommendedPensionSaving;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-slate-800">
        שכיר מול עצמאי — השוואת נטו
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="font-medium text-slate-700">כשכיר</div>
          <label className="text-sm text-slate-600 block">
            שכר ברוטו חודשי
            <input
              type="number"
              value={employeeGross}
              onChange={(e) => setEmployeeGross(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="text-sm text-slate-600">
            נטו משוער: <b className="text-brand-700">{ils(employeeResult.netMonthly)}</b>
          </div>
          <p className="text-xs text-slate-500">
            כולל הפרשות פנסיה/פיצויים אוטומטיות מהמעביד, ימי חופשה/מחלה/הבראה
            בתשלום.
          </p>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="font-medium text-slate-700">כעצמאי</div>
          <label className="text-sm text-slate-600 block">
            הכנסה חודשית (מחזור)
            <input
              type="number"
              value={freelancerRevenue}
              onChange={(e) => setFreelancerRevenue(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm text-slate-600 block">
            הוצאות עסקיות מוכרות חודשיות
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="text-sm text-slate-600">
            נטו משוער לפני חיסכון פנסיוני עצמאי:{" "}
            <b>{ils(freelancerResult.netMonthly)}</b>
          </div>
          <div className="text-sm text-slate-600">
            נטו משוער אחרי הפרשה עצמית לפנסיה (~14.5%):{" "}
            <b className="text-brand-700">{ils(freelancerNetAfterSelfPension)}</b>
          </div>
          <p className="text-xs text-slate-500">
            עצמאי אחראי בעצמו על חיסכון פנסיוני, ואין לו ימי חופשה/מחלה
            בתשלום — "יום בלי עבודה = יום בלי הכנסה".
          </p>
        </div>
      </div>

      <label className="text-sm text-slate-600 block max-w-xs">
        נקודות זיכוי (משותף להשוואה)
        <input
          type="number"
          step="0.25"
          value={creditPoints}
          onChange={(e) => setCreditPoints(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <p className="text-xs text-amber-600">
        ⚠️ השוואה כלכלית מקורבת בלבד ({DATA_AS_OF}), לצורכי המחשה. אינה
        מתחשבת בכל המשתנים (מע"מ, ביטוחים נוספים, תנודתיות הכנסה, עלויות
        ניהול חשבונות) — לפני החלטה מומלץ לבנות תחשיב מלא מול רו"ח/יועץ מס.
      </p>
    </div>
  );
}
