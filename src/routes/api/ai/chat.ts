import { createFileRoute } from "@tanstack/react-router";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.GROQ_API_KEY;
        if (!key) {
          return new Response(
            "Server AI is not configured. Set GROQ_API_KEY in the deployment environment (.env).",
            { status: 503 },
          );
        }
        let body: {
          messages: { role: "system" | "user" | "assistant"; content: string }[];
          temperature?: number;
          model?: string;
        };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }
        if (!Array.isArray(body?.messages)) {
          return new Response("messages[] required", { status: 400 });
        }

        const upstream = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: body.model ?? DEFAULT_MODEL,
            messages: body.messages,
            temperature: body.temperature ?? 0.6,
            stream: true,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const errText = await upstream.text().catch(() => "");
          return new Response(`Upstream ${upstream.status}: ${errText.slice(0, 400)}`, {
            status: 502,
          });
        }

        // Transform SSE deltas into a plain text stream that the client concatenates.
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
          async pull(controller) {
            let buf = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              buf += decoder.decode(value, { stream: true });
              const parts = buf.split("\n");
              buf = parts.pop() ?? "";
              for (const line of parts) {
                const l = line.trim();
                if (!l.startsWith("data:")) continue;
                const payload = l.slice(5).trim();
                if (payload === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const j = JSON.parse(payload);
                  const delta = j.choices?.[0]?.delta?.content;
                  if (delta) controller.enqueue(encoder.encode(delta));
                } catch {
                  /* ignore */
                }
              }
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
