import { createFileRoute } from "@tanstack/react-router";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const Route = createFileRoute("/api/ai/json")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.GROQ_API_KEY;
        if (!key) {
          return Response.json(
            { error: "Server AI is not configured. Set GROQ_API_KEY in .env." },
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
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        if (!Array.isArray(body?.messages)) {
          return Response.json({ error: "messages[] required" }, { status: 400 });
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
            temperature: body.temperature ?? 0.3,
            response_format: { type: "json_object" },
          }),
        });

        if (!upstream.ok) {
          const errText = await upstream.text().catch(() => "");
          return Response.json(
            { error: `Upstream ${upstream.status}: ${errText.slice(0, 400)}` },
            { status: 502 },
          );
        }
        const j = await upstream.json();
        const text = j.choices?.[0]?.message?.content ?? "{}";
        try {
          return Response.json({ data: JSON.parse(text) });
        } catch {
          return Response.json({ error: "Model returned invalid JSON" }, { status: 502 });
        }
      },
    },
  },
});
