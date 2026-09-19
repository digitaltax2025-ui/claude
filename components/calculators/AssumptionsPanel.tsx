"use client";

import { useState } from "react";
import {
  DATA_AS_OF,
  INCOME_TAX_BRACKETS_ANNUAL,
  CREDIT_POINT_VALUE,
  NATIONAL_INSURANCE_EMPLOYEE,
  NATIONAL_INSURANCE_SELF_EMPLOYED,
} from "@/lib/taxRates";

/**
 * חושפת את טבלת ההנחות שביסוד המחשבונים, כדי לעמוד בדרישת האפיון
 * (docs/agent-brief.md): "להציג קלט, תקופה, נוסחה, מטבע, מקורות לשיעורים
 * ותקרות, כללי עיגול ותוצאה" ולא להסתיר שיעורים שהוזנו כברירת מחדל שקטה.
 */
export default function AssumptionsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-right px-4 py-3 flex items-center justify-between gap-2"
      >
        <span className="font-medium">
          ⚠️ מצב אימות הנתונים: <b>לא אומת מול מקור נוכחי</b> — {DATA_AS_OF}
        </span>
        <span className="text-sm underline">{open ? "הסתר הנחות" : "הצג הנחות מלאות"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm space-y-3 border-t border-amber-200 pt-3">
          <p>
            המחשבונים שלהלן הם רכיב ניסיוני (שלב מאוחר בתוכנית ההקמה לפי{" "}
            <code>docs/agent-brief.md</code>). כל שיעור ותקרה כאן הם ערך
            דוגמה קבוע בקוד, ללא בדיקת תאריך תחולה מול המקור הרשמי. אין
            להשתמש בתוצאה כקביעה סופית בתיק.
          </p>

          <div>
            <div className="font-medium mb-1">מדרגות מס הכנסה שנתיות (ש"ח, דוגמה)</div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-amber-700">
                  <th className="text-right font-normal">עד</th>
                  <th className="text-right font-normal">שיעור</th>
                </tr>
              </thead>
              <tbody>
                {INCOME_TAX_BRACKETS_ANNUAL.map((b, i) => (
                  <tr key={i} className="border-t border-amber-200">
                    <td className="py-1">
                      {b.upTo === Infinity ? "ומעלה" : b.upTo.toLocaleString("he-IL")}
                    </td>
                    <td className="py-1">{Math.round(b.rate * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="font-medium mb-1">נקודת זיכוי</div>
            <div>
              {CREDIT_POINT_VALUE.monthly.toLocaleString("he-IL")} ₪ לחודש /{" "}
              {CREDIT_POINT_VALUE.annual.toLocaleString("he-IL")} ₪ לשנה
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">ביטוח לאומי ומס בריאות — שכיר</div>
            <div>
              עד {NATIONAL_INSURANCE_EMPLOYEE.reducedRateThreshold.toLocaleString("he-IL")} ₪:{" "}
              {(NATIONAL_INSURANCE_EMPLOYEE.belowThreshold.ni * 100).toFixed(2)}% ני +{" "}
              {(NATIONAL_INSURANCE_EMPLOYEE.belowThreshold.health * 100).toFixed(2)}% בריאות.
              מעל: {(NATIONAL_INSURANCE_EMPLOYEE.aboveThreshold.ni * 100).toFixed(2)}% ני +{" "}
              {(NATIONAL_INSURANCE_EMPLOYEE.aboveThreshold.health * 100).toFixed(2)}% בריאות.
              תקרה: {NATIONAL_INSURANCE_EMPLOYEE.ceiling.toLocaleString("he-IL")} ₪.
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">ביטוח לאומי ומס בריאות — עצמאי</div>
            <div>
              עד {NATIONAL_INSURANCE_SELF_EMPLOYED.reducedRateThreshold.toLocaleString("he-IL")} ₪:{" "}
              {(NATIONAL_INSURANCE_SELF_EMPLOYED.belowThreshold.ni * 100).toFixed(2)}% ני +{" "}
              {(NATIONAL_INSURANCE_SELF_EMPLOYED.belowThreshold.health * 100).toFixed(2)}% בריאות.
              מעל: {(NATIONAL_INSURANCE_SELF_EMPLOYED.aboveThreshold.ni * 100).toFixed(2)}% ני +{" "}
              {(NATIONAL_INSURANCE_SELF_EMPLOYED.aboveThreshold.health * 100).toFixed(2)}% בריאות.
              תקרה: {NATIONAL_INSURANCE_SELF_EMPLOYED.ceiling.toLocaleString("he-IL")} ₪.
            </div>
          </div>

          <p className="text-amber-700">
            מקור הטבלה: <code>lib/taxRates.ts</code>. יש להחליף בערכים
            מאומתים מרשות המסים והמוסד לביטוח לאומי, לתאריך הרלוונטי לתיק,
            לפני כל שימוש מקצועי.
          </p>
        </div>
      )}
    </div>
  );
}
