// Client-side AI helpers. All calls go through the server (/api/ai/*) so the
// Groq API key stays on the server (.env → GROQ_API_KEY). Users never see or
// configure any AI key.

type Msg = { role: "system" | "user" | "assistant"; content: string };

/** Kept for backwards compatibility; AI is always enabled server-side. */
export function hasAiKey() {
  return true;
}

/** Stream a chat completion. Server proxies Groq and forwards content deltas as plain text. */
export async function streamCompletion(
  messages: Msg[],
  onToken: (chunk: string) => void,
  opts: { temperature?: number; model?: string } = {},
) {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, ...opts }),
    });
    if (!res.ok || !res.body) {
      const err = await res.text().catch(() => "");
      onToken(`\n[AI error ${res.status}] ${err.slice(0, 240)}`);
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = dec.decode(value, { stream: true });
      if (chunk) onToken(chunk);
    }
  } catch (e) {
    onToken(`\n[AI network error] ${String(e).slice(0, 240)}`);
  }
}

/** Non-streaming: concatenate the stream. */
export async function complete(messages: Msg[], opts?: { temperature?: number; model?: string }) {
  let out = "";
  await streamCompletion(messages, (t) => (out += t), opts);
  return out;
}

/** JSON-mode completion via /api/ai/json. Returns parsed object or null. */
export async function completeJson<T = unknown>(
  messages: Msg[],
  opts: { temperature?: number; model?: string } = {},
): Promise<T | null> {
  try {
    const res = await fetch("/api/ai/json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, ...opts }),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: T; error?: string };
    return (j.data as T) ?? null;
  } catch {
    return null;
  }
}
