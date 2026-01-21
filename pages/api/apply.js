import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, goal, experience, daysPerWeek, equipment, submittedAt } = req.body || {};

    // Basic validation
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

    const receiver = process.env.APPLICATION_RECEIVER_EMAIL;
    if (!receiver) return res.status(500).json({ error: "Missing APPLICATION_RECEIVER_EMAIL" });
    if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: "Missing RESEND_API_KEY" });

    const goalLabel =
      goal === "fat_loss" ? "Fat Loss" : goal === "muscle_gain" ? "Muscle Gain" : "General Fitness";

    const subject = `New CBPUMP Application: ${name} (${goalLabel})`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2 style="margin: 0 0 12px;">New Coaching Application</h2>

        <table cellpadding="6" style="border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Goal</strong></td><td>${escapeHtml(goalLabel)}</td></tr>
          <tr><td><strong>Experience</strong></td><td>${escapeHtml(experience)}</td></tr>
          <tr><td><strong>Days/week</strong></td><td>${daysPerWeek}</td></tr>
          <tr><td><strong>Equipment</strong></td><td>${escapeHtml(equipment.join(", "))}</td></tr>
          <tr><td><strong>Submitted</strong></td><td>${escapeHtml(submittedAt || "")}</td></tr>
        </table>

        <hr style="margin: 16px 0;" />
        <p style="margin: 0; color: #666;">
          Sent from your CBPUMP apply form.
        </p>
      </div>
    `;

    // IMPORTANT: "from" must be a verified sender/domain in Resend
    const from = "CBPUMP Applications <onboarding@yourdomain.com>";

    const result = await resend.emails.send({
      from,
      to: receiver,
      replyTo: email, // so you can hit reply to respond to the applicant
      subject,
      html,
    });

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return res.status(500).json({ error: "Email failed to send" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("APPLY API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
