const GOOGLE_TRANSLATE_ENDPOINT =
  "https://translation.googleapis.com/language/translate/v2"

type TranslationRequest = {
  text?: unknown
  targets?: unknown
}

export async function POST(request: Request) {
  let body: TranslationRequest
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: "Send a valid JSON request." },
      { status: 400 }
    )
  }

  const text = typeof body.text === "string" ? body.text.trim() : ""
  const targets = Array.isArray(body.targets)
    ? body.targets.filter(
        (target): target is string => typeof target === "string"
      )
    : []

  if (
    !text ||
    text.length > 120 ||
    targets.length === 0 ||
    targets.length > 6
  ) {
    return Response.json(
      { error: "Enter a word and choose between one and six languages." },
      { status: 400 }
    )
  }

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Translation is ready for setup. Add GOOGLE_CLOUD_TRANSLATE_API_KEY to .env.",
      },
      { status: 503 }
    )
  }

  try {
    const translations = await Promise.all(
      targets.map(async (target) => {
        const response = await fetch(
          `${GOOGLE_TRANSLATE_ENDPOINT}?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, target, format: "text" }),
          }
        )
        const result = await response.json()
        if (!response.ok) {
          throw new Error(
            result?.error?.message ?? "Google Translation request failed."
          )
        }
        return {
          target,
          text: result.data.translations[0].translatedText as string,
        }
      })
    )
    return Response.json({ translations })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Translation failed." },
      { status: 502 }
    )
  }
}
