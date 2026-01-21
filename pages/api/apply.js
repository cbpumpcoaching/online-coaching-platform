export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, goal, experience, daysPerWeek, equipment, submittedAt } = req.body || {};

    // Basic validation (simple + beginner-friendly)
    if (!name || typeof name !== "string") return res.status(400).json({ error: "Invalid name" });
    if (!email || typeof email !== "string") return res.status(400).json({ error: "Invalid email" });

    const allowedGoals = ["fat_loss", "muscle_gain", "fitness"];
    if (!allowedGoals.includes(goal)) return res.status(400).json({ error: "Invalid goal" });

    const allowedExperience = ["beginner", "intermediate", "advanced"];
    if (!allowedExperience.includes(experience))
      return res.status(400).json({ error: "Invalid experience" });

    if (!Number.isInteger(daysPerWeek) || daysPerWeek < 2 || daysPerWeek > 6) {
      return res.status(400).json({ error: "Invalid daysPerWeek" });
    }

    if (!Array.isArray(equipment) || equipment.length === 0) {
      return res.status(400).json({ error: "Invalid equipment" });
    }

    // For now: log it (you can view this in Vercel logs or your terminal)
    console.log("NEW APPLICATION:", {
      name,
      email,
      goal,
      experience,
      daysPerWeek,
      equipment,
      submittedAt,
      receivedAt: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("APPLY API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
