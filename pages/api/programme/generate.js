// /pages/api/programme/generate.js
import { generateProgramme } from "../../../lib/generateProgramme";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const programme = generateProgramme(req.body || {});
    return res.status(200).json(programme);
  } catch (err) {
    console.error("Programme generation error:", err);

    return res.status(500).json({
      error: "Programme generation failed",
      message: err?.message || String(err),
      // stack is helpful for debugging; okay for now in a private beta
      stack: err?.stack || null,
    });
  }
}
