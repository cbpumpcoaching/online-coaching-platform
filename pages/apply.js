import { useMemo, useState } from "react";
import Head from "next/head";

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "New to structured training or returning after a break." },
  { id: "intermediate", label: "Intermediate", desc: "Training consistently with basic technique and progression." },
  { id: "advanced", label: "Advanced", desc: "Experienced lifter with strong technique and clear goals." },
];

const GOALS = [
  { id: "muscle_gain", label: "Muscle Gain" },
  { id: "fat_loss", label: "Fat Loss" },
  { id: "overall_fitness", label: "Improve Overall Fitness" },
];

function calcBMR({ gender, age, weightKg, heightCm }) {
  // Mifflin-St Jeor
  const w = Number(weightKg);
  const h = Number(heightCm);
  const a = Number(age);
  if (!w || !h || !a) return null;
  const base = 10 * w + 6.25 * h - 5 * a;
  if (gender === "male") return Math.round(base + 5);
  if (gender === "female") return Math.round(base - 161);
  return Math.round(base); // fallback
}

function activityMultiplier(activity) {
  switch (activity) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "very":
      return 1.725;
    default:
      return 1.55;
  }
}

function macroTargets({ goal, tdee }) {
  if (!tdee) return null;

  let calories = tdee;
  if (goal === "fat_loss") calories = Math.round(tdee * 0.85);
  if (goal === "muscle_gain") calories = Math.round(tdee * 1.08);
  if (goal === "overall_fitness") calories = Math.round(tdee);

  // Simple macro split
  // Protein: 30%, Fat: 25%, Carbs: rest
  const proteinCals = Math.round(calories * 0.3);
  const fatCals = Math.round(calories * 0.25);
  const carbCals = calories - proteinCals - fatCals;

  const proteinG = Math.round(proteinCals / 4);
  const fatG = Math.round(fatCals / 9);
  const carbsG = Math.round(carbCals / 4);

  return { calories, proteinG, carbsG, fatG };
}

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // basics
    fullName: "",
    email: "",
    gender: "male",
    age: "",
    heightCm: "",
    weightKg: "",

    // coaching selections
    level: "beginner",
    goal: "muscle_gain",

    // lifestyle / constraints
    activity: "moderate",
    trainingExperience: "",
    injuries: "",
    equipmentAccess: "Gym",
    daysAvailable: "4",
    foodPreferences: "",
  });

  const bmr = useMemo(() => calcBMR(form), [form]);
  const tdee = useMemo(() => {
    if (!bmr) return null;
    return Math.round(bmr * activityMultiplier(form.activity));
  }, [bmr, form.activity]);

  const macros = useMemo(() => macroTargets({ goal: form.goal, tdee }), [form.goal, tdee]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1() {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.age || !form.heightCm || !form.weightKg) return "Please fill in age, height, and weight.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateStep1();
    if (err) return alert(err);

    try {
      setSubmitting(true);

      // For now we store locally (no database yet).
      // Next step can be saving to a DB (Supabase/Firebase) and tying to PayPal subscription.
      const payload = {
        ...form,
        createdAt: new Date().toISOString(),
        computed: { bmr, tdee, macros },
        brand: "CBPUMP",
      };

      // Save in browser so we can show it on the dashboard later (simple MVP)
      localStorage.setItem("cbpump_onboarding", JSON.stringify(payload));

      setSubmitted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Apply | CBPUMP Coaching</title>
      </Head>

      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>CBPUMP Coaching</h1>
              <p style={styles.subtitle}>
                Apply in 2 minutes. We’ll tailor your 4-day training + nutrition plan to your level and goal.
              </p>
            </div>
            <a href="/" style={styles.link}>
              ← Back to Home
            </a>
          </header>

          {submitted ? (
            <section style={styles.card}>
              <h2 style={styles.h2}>You’re in ✅</h2>
              <p style={styles.p}>
                Thanks, <strong>{form.fullName || "client"}</strong>. Your CBPUMP onboarding has been saved.
              </p>

              <div style={styles.grid2}>
                <div style={styles.panel}>
                  <h3 style={styles.h3}>Your selections</h3>
                  <ul style={styles.list}>
                    <li>
                      <strong>Level:</strong> {LEVELS.find((l) => l.id === form.level)?.label}
                    </li>
                    <li>
                      <strong>Goal:</strong> {GOALS.find((g) => g.id === form.goal)?.label}
                    </li>
                    <li>
                      <strong>Days/week:</strong> 4
                    </li>
                  </ul>
                </div>

                <div style={styles.panel}>
                  <h3 style={styles.h3}>Estimated targets</h3>
                  {macros ? (
                    <ul style={styles.list}>
                      <li>
                        <strong>Calories/day:</strong> {macros.calories}
                      </li>
                      <li>
                        <strong>Protein:</strong> {macros.proteinG}g
                      </li>
                      <li>
                        <strong>Carbs:</strong> {macros.carbsG}g
                      </li>
                      <li>
                        <strong>Fat:</strong> {macros.fatG}g
                      </li>
                    </ul>
                  ) : (
                    <p style={styles.pSmall}>Fill in your stats to calculate targets.</p>
                  )}
                </div>
              </div>

              <div style={styles.actions}>
                <a href="/pricing" style={styles.primaryBtn}>
                  Continue to Payment (£30/mo)
                </a>
                <a href="/" style={styles.secondaryBtn}>
                  Return Home
                </a>
              </div>

              <p style={styles.pSmall}>
                Next: we’ll connect this to PayPal + a client dashboard so plans unlock after subscription.
              </p>
            </section>
          ) : (
            <form onSubmit={handleSubmit} style={styles.card}>
              <div style={styles.stepRow}>
                <span style={styles.stepPill}>Step {step} of 2</span>
                <span style={styles.stepHint}>We use this to tailor training + nutrition.</span>
              </div>

              {step === 1 ? (
                <>
                  <h2 style={styles.h2}>Your details</h2>

                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Full name</label>
                      <input
                        style={styles.input}
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Email</label>
                      <input
                        style={styles.input}
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        type="email"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Gender</label>
                      <select
                        style={styles.input}
                        value={form.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label style={styles.label}>Age</label>
                      <input
                        style={styles.input}
                        value={form.age}
                        onChange={(e) => updateField("age", e.target.value)}
                        placeholder="e.g. 26"
                        type="number"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Height (cm)</label>
                      <input
                        style={styles.input}
                        value={form.heightCm}
                        onChange={(e) => updateField("heightCm", e.target.value)}
                        placeholder="e.g. 178"
                        type="number"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Weight (kg)</label>
                      <input
                        style={styles.input}
                        value={form.weightKg}
                        onChange={(e) => updateField("weightKg", e.target.value)}
                        placeholder="e.g. 80"
                        type="number"
                      />
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.primaryBtn}
                      onClick={() => {
                        const err = validateStep1();
                        if (err) return alert(err);
                        setStep(2);
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={styles.h2}>Your coaching plan</h2>

                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Level</label>
                      <div style={{ display: "grid", gap: 10 }}>
                        {LEVELS.map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => updateField("level", lvl.id)}
                            style={{
                              ...styles.choice,
                              ...(form.level === lvl.id ? styles.choiceActive : {}),
                            }}
                          >
                            <div style={{ fontWeight: 700 }}>{lvl.label}</div>
                            <div style={styles.choiceDesc}>{lvl.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={styles.label}>Goal</label>
                      <div style={{ display: "grid", gap: 10 }}>
                        {GOALS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => updateField("goal", g.id)}
                            style={{
                              ...styles.choice,
                              ...(form.goal === g.id ? styles.choiceActive : {}),
                            }}
                          >
                            <div style={{ fontWeight: 700 }}>{g.label}</div>
                          </button>
                        ))}
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <label style={styles.label}>Activity level (non-gym)</label>
                        <select
                          style={styles.input}
                          value={form.activity}
                          onChange={(e) => updateField("activity", e.target.value)}
                        >
                          <option value="sedentary">Sedentary (desk job, low steps)</option>
                          <option value="light">Light (some walking, active job sometimes)</option>
                          <option value="moderate">Moderate (regular steps / active job)</option>
                          <option value="very">Very active (physical job, high steps)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Training experience (optional)</label>
                      <input
                        style={styles.input}
                        value={form.trainingExperience}
                        onChange={(e) => updateField("trainingExperience", e.target.value)}
                        placeholder="e.g. 2 years, mostly machines, want to learn free weights"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Injuries / limitations (optional)</label>
                      <input
                        style={styles.input}
                        value={form.injuries}
                        onChange={(e) => updateField("injuries", e.target.value)}
                        placeholder="e.g. lower back sensitivity, shoulder impingement"
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Equipment access</label>
                      <select
                        style={styles.input}
                        value={form.equipmentAccess}
                        onChange={(e) => updateField("equipmentAccess", e.target.value)}
                      >
                        <option>Gym</option>
                        <option>Home (basic)</option>
                        <option>Home (full)</option>
                      </select>
                    </div>

                    <div>
                      <label style={styles.label}>Food preferences (optional)</label>
                      <input
                        style={styles.input}
                        value={form.foodPreferences}
                        onChange={(e) => updateField("foodPreferences", e.target.value)}
                        placeholder="e.g. halal, vegetarian, no dairy"
                      />
                    </div>
                  </div>

                  <section style={styles.summary}>
                    <h3 style={styles.h3}>Estimated nutrition targets</h3>
                    {macros ? (
                      <div style={styles.macroRow}>
                        <div style={styles.macroBox}>
                          <div style={styles.macroLabel}>Calories</div>
                          <div style={styles.macroValue}>{macros.calories}</div>
                        </div>
                        <div style={styles.macroBox}>
                          <div style={styles.macroLabel}>Protein (g)</div>
                          <div style={styles.macroValue}>{macros.proteinG}</div>
                        </div>
                        <div style={styles.macroBox}>
                          <div style={styles.macroLabel}>Carbs (g)</div>
                          <div style={styles.macroValue}>{macros.carbsG}</div>
                        </div>
                        <div style={styles.macroBox}>
                          <div style={styles.macroLabel}>Fat (g)</div>
                          <div style={styles.macroValue}>{macros.fatG}</div>
                        </div>
                      </div>
                    ) : (
                      <p style={styles.pSmall}>Go back and enter your stats to calculate targets.</p>
                    )}

                    <p style={styles.pSmall}>
                      These are starting estimates. CBPUMP coaching will adjust based on weekly progress + check-ins.
                    </p>
                  </section>

                  <div style={styles.actions}>
                    <button type="button" style={styles.secondaryBtn} onClick={() => setStep(1)}>
                      ← Back
                    </button>

                    <button type="submit" style={styles.primaryBtn} disabled={submitting}>
                      {submitting ? "Saving..." : "Save & Continue"}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          <footer style={styles.footer}>© {new Date().getFullYear()} CBPUMP</footer>
        </div>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    color: "#111",
    padding: "40px 16px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  container: { maxWidth: 980, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  title: { fontSize: 28, margin: 0 },
  subtitle: { marginTop: 8, marginBottom: 0, color: "#444", maxWidth: 640, lineHeight: 1.5 },
  link: { color: "#111", textDecoration: "underline", fontWeight: 600, whiteSpace: "nowrap" },

  card: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 22,
    background: "#fff",
  },

  stepRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 },
  stepPill: {
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #e5e5e5",
  },
  stepHint: { fontSize: 12, color: "#666" },

  h2: { fontSize: 22, marginTop: 0, marginBottom: 14 },
  h3: { fontSize: 16, marginTop: 0, marginBottom: 10 },
  p: { color: "#333", lineHeight: 1.6 },
  pSmall: { color: "#666", fontSize: 13, lineHeight: 1.6 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14,
  },

  choice: {
    textAlign: "left",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  choiceActive: {
    border: "1px solid #111",
    boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
  },
  choiceDesc: { color: "#666", fontSize: 13, marginTop: 4, lineHeight: 1.4 },

  summary: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 14,
    background: "#fafafa",
    marginTop: 6,
    marginBottom: 14,
  },
  macroRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  macroBox: { border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, background: "#fff" },
  macroLabel: { fontSize: 12, color: "#666", fontWeight: 700 },
  macroValue: { fontSize: 18, fontWeight: 800, marginTop: 6 },

  actions: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  primaryBtn: {
    display: "inline-block",
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
  },
  secondaryBtn: {
    display: "inline-block",
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
  },

  panel: { border: "1px solid #eee", borderRadius: 12, padding: 14, background: "#fafafa" },
  list: { margin: 0, paddingLeft: 16, color: "#333", lineHeight: 1.7 },

  footer: { marginTop: 18, color: "#777", fontSize: 12, textAlign: "center" },
};
