export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("❌ Missing GOOGLE_SHEETS_WEBHOOK_URL env var");
    return res.status(500).json({ error: "Missing GOOGLE_SHEETS_WEBHOOK_URL env var" });
  }

  try {
    const body = req.body || {};

    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();

    console.log("Sheets webhook status:", r.status);
    console.log("Sheets webhook response:", text);

    if (!r.ok) {
      return res.status(500).json({ error: "Webhook failed", details: text });
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.ok === false) {
        return res.status(500).json({ error: "Apps Script error", details: parsed.error });
      }
    } catch (_) {}

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ APPLY API ERROR:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
