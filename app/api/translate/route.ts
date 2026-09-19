import { TRANSLATION_LANGUAGE_CODES } from "@/config/translation";

const GOOGLE_TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON request." }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const targets = Array.isArray(payload.targets) ? payload.targets : [];

  if (
    !text ||
    text.length > 120 ||
    targets.length === 0 ||
    targets.length > 6 ||
    targets.some((target) => typeof target !== "string" || !TRANSLATION_LANGUAGE_CODES.has(target)) ||
    new Set(targets).size !== targets.length
  ) {
    return Response.json({ error: "Enter a word and choose between one and six languages." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Translation is unavailable right now." }, { status: 503 });
  }

  try {
    const translations = await Promise.all(
      (targets as string[]).map(async (target) => {
        const response = await fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, target, format: "text" }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error?.message ?? "Translation request failed.");
        }
        const translatedText = result?.data?.translations?.[0]?.translatedText;
        if (typeof translatedText !== "string") throw new Error("Invalid translation response.");
        return {
          target,
          text: translatedText,
        };
      })
    );
    return Response.json({ translations });
  } catch (error) {
    console.error("Translation request failed", error);
    return Response.json({ error: "Translation failed. Try again in a moment." }, { status: 502 });
  }
}
