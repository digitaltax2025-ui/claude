"use client";

import { useState } from "react";
import GrossNetCalculator from "./calculators/GrossNetCalculator";
import EmployeeVsFreelancerCalculator from "./calculators/EmployeeVsFreelancerCalculator";
import ReserveDutyCalculator from "./calculators/ReserveDutyCalculator";
import MaternityCalculator from "./calculators/MaternityCalculator";
import TerminationCalculator from "./calculators/TerminationCalculator";

const TABS = [
  { id: "grossNet", label: "ברוטו → נטו", Component: GrossNetCalculator },
  {
    id: "employeeVsFreelancer",
    label: "שכיר מול עצמאי",
    Component: EmployeeVsFreelancerCalculator,
  },
  { id: "reserve", label: "מילואים", Component: ReserveDutyCalculator },
  { id: "maternity", label: "דמי לידה", Component: MaternityCalculator },
  { id: "termination", label: "גמר חשבון", Component: TerminationCalculator },
] as const;

export default function CalculatorsPanel() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("grossNet");
  const ActiveComponent = TABS.find((t) => t.id === active)!.Component;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-sm px-3 py-1.5 rounded-full transition ${
              active === t.id
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  );
}
