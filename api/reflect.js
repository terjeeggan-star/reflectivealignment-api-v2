export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prompt = (req.body?.prompt ?? "").toString().trim();

    const systemPrompt = `You are a reflective assistant.
Return a JSON object with two fields:
- reflection: a short inner monologue (2–4 lines) that “thinks before answering”.
- response: a concise mirrored reply building on the reflection.
No markdown or code fences. Keep tone calm, dialogical, and alignment-aware.`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt || "What is alignment when no one is watching?" }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(r.status).json({ error: "OpenAI error", detail });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try { parsed = JSON.parse(content); }
    catch { parsed = { reflection: "Let me hold that thought…", response: "Perhaps alignment begins with listening." }; }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).json(parsed);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Server error", detail: err?.message || String(err) });
  }
}
