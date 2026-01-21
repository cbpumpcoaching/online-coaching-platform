export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: "Missing GOOGLE_SHEETS_WEBHOOK_URL env var" });
  }

  try {
    const body = req.body || {};

    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await r.text();

    // Vercel logs
    console.log("Sheets webhook URL:", webhookUrl);
    console.log("Sheets webhook status:", r.status);
    console.log("Sheets webhook response:", text);

    // Return the exact response to the browser too (so you can see it)
    return res.status(r.ok ? 200 : 500).json({
      ok: r.ok,
      status: r.status,
      webhookResponse: text,
    });
  } catch (err) {
    console.error("Apply API error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
