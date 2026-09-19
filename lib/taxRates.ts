/**
 * ⚠️ טבלת נתונים כספיים — יש לעדכן שנתית (בד"כ בינואר) ובכל שינוי חקיקה.
 *
 * המספרים כאן הם ערכי **דוגמה להמחשה** בלבד, מבוססים על מבנה המדרגות
 * הידוע (השיעורים עצמם יציבים לאורך שנים; הסכומים בשקלים כן זזים כל שנה
 * עם מדד/חקיקה). לפני כל שימוש בפועל — יש לאמת את הסכומים המדויקים מול:
 *   - רשות המסים בישראל (מדרגות מס הכנסה, נקודת זיכוי, תקרות)
 *   - המוסד לביטוח לאומי (תקרות ואחוזי דמי ביטוח, שכר מבוטח למילואים/לידה)
 *   - עדכון "כל זכות" / הודעות רשמיות (שכר מינימום, דמי הבראה)
 *
 * כל שדה מסומן עם dataAsOf כדי שיהיה ברור באיזה מועד עודכן בפועל.
 */

export const DATA_AS_OF = "לא עודכן מול מקור רשמי — ערכי דוגמה בלבד";

/** מדרגות מס הכנסה שנתיות ליחיד (שכיר/עצמאי), ברוטו ש"ח לשנה. דוגמה בלבד. */
export const INCOME_TAX_BRACKETS_ANNUAL = [
  { upTo: 84120, rate: 0.1 },
  { upTo: 120720, rate: 0.14 },
  { upTo: 193800, rate: 0.2 },
  { upTo: 269280, rate: 0.31 },
  { upTo: 560280, rate: 0.35 },
  { upTo: 721560, rate: 0.47 },
  { upTo: Infinity, rate: 0.5 }, // כולל "מס יסף" של 3% מעל תקרה גבוהה נפרדת
];

/** שווי נקודת זיכוי חודשית / שנתית — ערך דוגמה. */
export const CREDIT_POINT_VALUE = {
  monthly: 242,
  annual: 242 * 12,
};

/** נקודות זיכוי בסיסיות (דוגמה — תלוי מצב אישי, ר' docs/system-prompt.md §4.3). */
export const BASE_CREDIT_POINTS = {
  resident: 2.25,
  womanExtra: 0.5,
};

/** ביטוח לאומי + מס בריאות — שכיר. אחוזים משכר ברוטו חודשי, שתי מדרגות. */
export const NATIONAL_INSURANCE_EMPLOYEE = {
  reducedRateThreshold: 7522, // 60% מהשכר הממוצע במשק — ערך דוגמה
  belowThreshold: { ni: 0.004, health: 0.031 },
  aboveThreshold: { ni: 0.07, health: 0.05 },
  ceiling: 50695, // תקרת הכנסה חייבת בדמי ביטוח — ערך דוגמה
};

/** ביטוח לאומי — עצמאי. אחוזים מההכנסה החייבת השנתית, שתי מדרגות. */
export const NATIONAL_INSURANCE_SELF_EMPLOYED = {
  reducedRateThreshold: 7522,
  belowThreshold: { ni: 0.0287, health: 0.0387 },
  aboveThreshold: { ni: 0.1283, health: 0.05 },
  ceiling: 50695,
};

/** עלות מעביד — תוספת ממוצעת משוערת מעל שכר ברוטו (פנסיה, פיצויים, ני מעביד וכו'). */
export const EMPLOYER_COST_OVERHEAD_RANGE = { min: 0.2, max: 0.3 };

/** שכר מינימום חודשי — ערך דוגמה. */
export const MINIMUM_WAGE_MONTHLY = 5880;

/** דמי הבראה — תעריף יומי (דוגמה) וטבלת ימים לפי ותק. */
export const RECOVERY_PAY = {
  dailyRate: 418,
  daysByTenure: [
    { minYears: 0, maxYears: 1, days: 5 },
    { minYears: 1, maxYears: 2, days: 6 },
    { minYears: 2, maxYears: 3, days: 6 },
    { minYears: 3, maxYears: 4, days: 7 },
    { minYears: 4, maxYears: 5, days: 7 },
    { minYears: 5, maxYears: 6, days: 7 },
    { minYears: 6, maxYears: 7, days: 7 },
    { minYears: 7, maxYears: 8, days: 7 },
    { minYears: 8, maxYears: 9, days: 7 },
    { minYears: 9, maxYears: 10, days: 7 },
    { minYears: 10, maxYears: Infinity, days: 8 },
  ],
};

/** דמי לידה — תקרת הכנסה יומית מבוטחת (דוגמה) ומספר שבועות בסיסי. */
export const MATERNITY_ALLOWANCE = {
  dailyInsuredIncomeCeiling: 1721,
  fullPayWeeksSingleBirth: 15,
  extendedUnpaidOrPartialWeeks: 11, // חלק מתוך 26 השבועות הכוללים, בתנאים
};
