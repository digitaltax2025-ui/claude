import {
  INCOME_TAX_BRACKETS_ANNUAL,
  CREDIT_POINT_VALUE,
  NATIONAL_INSURANCE_EMPLOYEE,
  NATIONAL_INSURANCE_SELF_EMPLOYED,
  EMPLOYER_COST_OVERHEAD_RANGE,
  RECOVERY_PAY,
  MATERNITY_ALLOWANCE,
} from "./taxRates";

/** מחשב מס הכנסה שנתי לפי מדרגות (progressive), לפני נקודות זיכוי. */
export function calcIncomeTaxAnnual(annualIncome: number): number {
  let tax = 0;
  let lastCap = 0;
  for (const bracket of INCOME_TAX_BRACKETS_ANNUAL) {
    const taxableInBracket = Math.max(
      0,
      Math.min(annualIncome, bracket.upTo) - lastCap
    );
    tax += taxableInBracket * bracket.rate;
    lastCap = bracket.upTo;
    if (annualIncome <= bracket.upTo) break;
  }
  return Math.max(0, tax);
}

export function calcIncomeTaxAfterCreditPoints(
  annualIncome: number,
  creditPoints: number
): number {
  const gross = calcIncomeTaxAnnual(annualIncome);
  const credit = creditPoints * CREDIT_POINT_VALUE.annual;
  return Math.max(0, gross - credit);
}

/** ביטוח לאומי + מס בריאות חודשי, לפי סוג מבוטח. */
export function calcNationalInsuranceMonthly(
  monthlyIncome: number,
  kind: "employee" | "selfEmployed"
): { ni: number; health: number; total: number } {
  const table =
    kind === "employee"
      ? NATIONAL_INSURANCE_EMPLOYEE
      : NATIONAL_INSURANCE_SELF_EMPLOYED;

  const capped = Math.min(monthlyIncome, table.ceiling);
  const belowAmount = Math.min(capped, table.reducedRateThreshold);
  const aboveAmount = Math.max(0, capped - table.reducedRateThreshold);

  const ni =
    belowAmount * table.belowThreshold.ni + aboveAmount * table.aboveThreshold.ni;
  const health =
    belowAmount * table.belowThreshold.health +
    aboveAmount * table.aboveThreshold.health;

  return { ni, health, total: ni + health };
}

export interface GrossNetResult {
  grossMonthly: number;
  incomeTaxMonthly: number;
  nationalInsuranceMonthly: number;
  healthTaxMonthly: number;
  netMonthly: number;
}

export function calcGrossToNet(
  grossMonthly: number,
  creditPoints: number,
  kind: "employee" | "selfEmployed"
): GrossNetResult {
  const annual = grossMonthly * 12;
  const incomeTaxAnnual = calcIncomeTaxAfterCreditPoints(annual, creditPoints);
  const incomeTaxMonthly = incomeTaxAnnual / 12;
  const { ni, health } = calcNationalInsuranceMonthly(grossMonthly, kind);

  const netMonthly = grossMonthly - incomeTaxMonthly - ni - health;

  return {
    grossMonthly,
    incomeTaxMonthly,
    nationalInsuranceMonthly: ni,
    healthTaxMonthly: health,
    netMonthly,
  };
}

/** השוואת "עלות מעביד" לשכיר מול תעריף עצמאי נדרש להשגת אותה עלות. */
export function calcEmployerCostRange(grossMonthly: number) {
  return {
    min: grossMonthly * (1 + EMPLOYER_COST_OVERHEAD_RANGE.min),
    max: grossMonthly * (1 + EMPLOYER_COST_OVERHEAD_RANGE.max),
  };
}

/** דמי הבראה שנתיים לפי ותק (שנים). */
export function calcRecoveryPay(tenureYears: number): {
  days: number;
  amount: number;
} {
  const bracket = RECOVERY_PAY.daysByTenure.find(
    (b) => tenureYears >= b.minYears && tenureYears < b.maxYears
  );
  const days = bracket ? bracket.days : RECOVERY_PAY.daysByTenure[RECOVERY_PAY.daysByTenure.length - 1].days;
  return { days, amount: days * RECOVERY_PAY.dailyRate };
}

/** פיצויי פיטורים בסיסיים: משכורת אחרונה * שנות ותק (כולל חלקי שנה יחסית). */
export function calcSeverancePay(
  lastMonthlySalary: number,
  tenureYears: number
): number {
  return lastMonthlySalary * tenureYears;
}

/** הערכת תגמום מילואים יומי, בהתבסס על הכנסה מבוטחת ממוצעת (עד תקרה). */
export function calcReserveDutyDaily(
  avgMonthlyInsuredIncome: number,
  reserveDays: number
): { dailyPay: number; totalPay: number } {
  const dailyIncome = avgMonthlyInsuredIncome / 30;
  const cappedDaily = Math.min(
    dailyIncome,
    MATERNITY_ALLOWANCE.dailyInsuredIncomeCeiling // אותה תקרה יומית חלה גם על מילואים
  );
  return { dailyPay: cappedDaily, totalPay: cappedDaily * reserveDays };
}

/** הערכת דמי לידה יומיים, בהתבסס על שכר רבעון קודם (עד תקרה). */
export function calcMaternityDailyAllowance(
  avgMonthlyIncomeLast3Months: number
): { dailyAllowance: number; totalForFullPayPeriod: number } {
  const dailyIncome = avgMonthlyIncomeLast3Months / 30;
  const cappedDaily = Math.min(
    dailyIncome,
    MATERNITY_ALLOWANCE.dailyInsuredIncomeCeiling
  );
  const totalDays = MATERNITY_ALLOWANCE.fullPayWeeksSingleBirth * 7;
  return {
    dailyAllowance: cappedDaily,
    totalForFullPayPeriod: cappedDaily * totalDays,
  };
}
