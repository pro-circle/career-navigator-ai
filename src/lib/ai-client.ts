import { getSettings } from "./settings-store";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function hasAiKey() {
  return Boolean(getSettings().groqApiKey);
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

/** Call the AI (Groq OpenAI-compatible) with streaming. Falls back to a mock stream if no key. */
export async function streamCompletion(
  messages: Msg[],
  onToken: (chunk: string) => void,
  opts: { temperature?: number; model?: string } = {},
) {
  const key = getSettings().groqApiKey;
  if (!key) return mockStream(messages, onToken);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: opts.model ?? DEFAULT_MODEL,
        messages,
        temperature: opts.temperature ?? 0.6,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) {
      const err = await res.text().catch(() => "");
      onToken(`\n[AI error ${res.status}] ${err.slice(0, 200)}`);
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n");
      buf = parts.pop() ?? "";
      for (const line of parts) {
        const l = line.trim();
        if (!l.startsWith("data:")) continue;
        const payload = l.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const j = JSON.parse(payload);
          const delta = j.choices?.[0]?.delta?.content;
          if (delta) onToken(delta);
        } catch {
          /* ignore */
        }
      }
    }
  } catch (e) {
    onToken(`\n[AI network error] ${String(e).slice(0, 200)}`);
  }
}

/** Non-streaming convenience — returns the full string. */
export async function complete(messages: Msg[], opts?: { temperature?: number; model?: string }) {
  let out = "";
  await streamCompletion(messages, (t) => (out += t), opts);
  return out;
}

/** JSON-mode completion. Returns parsed object or null. */
export async function completeJson<T = unknown>(
  messages: Msg[],
  opts: { temperature?: number; model?: string } = {},
): Promise<T | null> {
  const key = getSettings().groqApiKey;
  if (!key) return null;
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: opts.model ?? DEFAULT_MODEL,
        messages,
        temperature: opts.temperature ?? 0.3,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const text = j.choices?.[0]?.message?.content ?? "";
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function mockStream(messages: Msg[], onToken: (chunk: string) => void) {
  const prompt = messages[messages.length - 1]?.content ?? "";
  const full =
    "[Mock mode — add a Groq API key in Settings to enable live AI]\n\n" +
    "Based on your prompt, here is a structured take: (1) lead with measurable impact, (2) cite one specific project with numbers, (3) close with a clarifying question. You asked: \"" +
    prompt.slice(0, 200) +
    "\".";
  for (const t of full.split(/(\s+)/)) {
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
    onToken(t);
  }
}
