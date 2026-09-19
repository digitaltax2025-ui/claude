import fs from "fs";
import path from "path";
import type Anthropic from "@anthropic-ai/sdk";

/**
 * טוען את קבצי החקיקה שאומתו בפועל (docs/legislation/*.pdf, ראו
 * docs/legislation/SOURCES.md) ומכין אותם כבלוקי מסמך ל-Claude, עם
 * citations מופעל כדי שהתשובות יוכלו להפנות למספר עמוד מדויק — בהתאם
 * לדרישת "אסמכתאות" ב-docs/system-prompt.md.
 *
 * לא כולל שום ניסיון לשחזר טקסט חוק מהזיכרון: אם קובץ לא הועלה ואומת,
 * הוא פשוט לא מופיע כאן, וה-system prompt מנחה את המודל לומר זאת
 * במפורש במקום להמציא.
 */

const LEGISLATION_DIR = path.join(process.cwd(), "docs", "legislation");

// תקרת ביטחון כדי שלא לשלוח בטעות עשרות MB בכל בקשה ברגע שמצטברים עוד
// קבצים (למשל פקודת מס הכנסה, שצפויה להיות גדולה בהרבה מחוק המע"מ).
const MAX_TOTAL_BASE64_BYTES = 15 * 1024 * 1024;

export interface LoadedLegislationDocs {
  blocks: Anthropic.ContentBlockParam[];
  fileNames: string[];
  skippedForSize: string[];
}

let cached: LoadedLegislationDocs | null = null;

export function getLegislationDocumentBlocks(): LoadedLegislationDocs {
  if (cached) return cached;

  const result: LoadedLegislationDocs = {
    blocks: [],
    fileNames: [],
    skippedForSize: [],
  };

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(LEGISLATION_DIR)
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort();
  } catch {
    cached = result;
    return result;
  }

  let totalBytes = 0;
  for (const fileName of files) {
    const filePath = path.join(LEGISLATION_DIR, fileName);
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString("base64");

    if (totalBytes + base64.length > MAX_TOTAL_BASE64_BYTES) {
      result.skippedForSize.push(fileName);
      continue;
    }
    totalBytes += base64.length;

    result.blocks.push({
      type: "document",
      title: fileName,
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: base64,
      },
      citations: { enabled: true },
    } as (typeof result.blocks)[number]);
    result.fileNames.push(fileName);
  }

  cached = result;
  return result;
}
