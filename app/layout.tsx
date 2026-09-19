import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "יועץ מיסוי יחיד ושכר | DigitalTax",
  description:
    "סוכן AI מומחה למיסוי יחיד ושכר בישראל — מיסים, ביטוח לאומי, דיני עבודה ומחשבוני שכר.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
