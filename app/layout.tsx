import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "עוזר מחקר למיסוי יחיד ושכר | אילן גרמן",
  description:
    "עוזר מחקר וניתוח פנימי עבור אילן גרמן, יועץ מס: בדיקת תיקים, בירור דין, הצלבת מסמכים וחישובים במיסוי היחיד, ביטוח לאומי, מע\"מ ודיני עבודה.",
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
