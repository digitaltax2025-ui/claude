import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/lib/systemPrompt";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

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
          max_tokens: 4096,
          system: getSystemPrompt(),
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
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
