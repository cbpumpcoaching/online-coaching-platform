export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // Print the submission to your server logs
    console.log("✅ NEW CBPUMP APPLICATION:");
    console.log(JSON.stringify(body, null, 2));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ APPLY API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
