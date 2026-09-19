import fs from "fs";
import path from "path";

/**
 * טוען את פרומפט המערכת מקובץ docs/system-prompt.md כדי שיהיה מקור אמת יחיד
 * (ניתן לערוך את התוכן במקום אחד, גם לצורך שימוש עצמאי מחוץ לאפליקציה).
 */
let cached: string | null = null;

export function getSystemPrompt(): string {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "docs", "system-prompt.md");
  cached = fs.readFileSync(filePath, "utf-8");
  return cached;
}
