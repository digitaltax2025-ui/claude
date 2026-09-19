import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/lib/systemPrompt";
import { getLegislationDocumentBlocks } from "@/lib/legislationDocuments";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * מקדים לשיחה בפועל "תור" סינתטי קבוע: המסמכים שאומתו (ראו
 * docs/legislation/SOURCES.md) ואישור קצר. זה נשאר זהה בכל בקשה, ולכן
 * ה-cache_control על הבלוק האחרון שומר על קידומת מטמון יציבה — המסמכים
 * נשלחים במלואם רק פעם אחת בכל חלון מטמון, לא בכל הודעה.
 */
function buildMessages(userMessages: ChatMessage[]): Anthropic.MessageParam[] {
  const { blocks, fileNames } = getLegislationDocumentBlocks();
  const history: Anthropic.MessageParam[] = userMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  if (blocks.length === 0) {
    return history;
  }

  const introText =
    `המסמכים המצורפים הם קובצי חקיקה שאומתו ונשמרו בריפו ` +
    `(docs/legislation/SOURCES.md): ${fileNames.join(", ")}. ` +
    `ניתן לצטט מהם ישירות עם מספר עמוד. כל מקור אחר שלא צורף כאן ` +
    `ולא נמצא בחיפוש רשת — יש לסמן כלא אומת, לא להשלים מהזיכרון.`;

  return [
    {
      role: "user",
      content: [
        ...blocks,
        {
          type: "text",
          text: introText,
          cache_control: { type: "ephemeral" },
        },
      ],
    },
    {
      role: "assistant",
      content:
        "התקבל. אשתמש במסמכים המצורפים כמקור מאומת עם ציטוט עמוד, ואסמן כל מקור אחר שאינו זמין לי כ\"לא אומת\".",
    },
    ...history,
  ];
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "לא הוגדר מפתח API. יש להגדיר את המשתנה ANTHROPIC_API_KEY (ראו .env.example) כדי להפעיל את הצ'אט.",
      }),
      { status: 501, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "חסרות הודעות בבקשה." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const anthropicStream = await client.messages.stream({
          model,
          max_tokens: 8192,
          system: getSystemPrompt(),
          messages: buildMessages(messages),
          tools: [
            {
              type: "web_search_20260209",
              name: "web_search",
              max_uses: 5,
            },
          ],
        });

        anthropicStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        anthropicStream.on("error", (err) => {
          controller.enqueue(
            encoder.encode(
              `\n\n[שגיאה בתקשורת עם המודל: ${
                err instanceof Error ? err.message : "שגיאה לא ידועה"
              }]`
            )
          );
          controller.close();
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `\n\n[שגיאה: ${err instanceof Error ? err.message : "שגיאה לא ידועה"}]`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
