import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const PRICE = 30;

const PLANS = [
  {
    id: "beginner",
    name: "Beginner",
    tagline: "Build confidence + consistency.",
    includes: [
      "4-day gym training plan (Beginner)",
      "Technique-first progression",
      "Nutrition targets + simple meal guidance",
      "Exercise demo videos (your library)",
      "Monthly check-in form + progress tracking",
    ],
    bestFor: "New lifters or anyone restarting training.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    tagline: "Build strength + shape.",
    includes: [
      "4-day gym training plan (Intermediate)",
      "Progressive overload structure",
      "Nutrition targets + flexible dieting",
      "Exercise demo videos (your library)",
      "Monthly check-in form + progress tracking",
    ],
    bestFor: "Consistent gym-goers ready to level up.",
    highlight: true,
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "Maximise performance + results.",
    includes: [
      "4-day gym training plan (Advanced)",
      "Volume/intensity management",
      "Nutrition targets + performance-focused guidance",
      "Exercise demo videos (your library)",
      "Monthly check-in form + progress tracking",
    ],
    bestFor: "Experienced lifters chasing specific outcomes.",
  },
];

const GOALS = [
  { id: "muscle_gain", label: "Muscle Gain" },
  { id: "fat_loss", label: "Fat Loss" },
  { id: "overall_fitness", label: "Improve Overall Fitness" },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("intermediate");
  const [selectedGoal, setSelectedGoal] = useState("muscle_gain");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved onboarding (if they already filled /apply)
    try {
      const saved = localStorage.getItem("cbpump_onboarding");
      if (saved) {
        const data = JSON.parse(saved);
        if (data?.level) setSelectedPlan(data.level);
        if (data?.goal) setSelectedGoal(data.goal);
      }
    } catch (e) {}
  }, []);

  const plan = useMemo(() => PLANS.find((p) => p.id === selectedPlan), [selectedPlan]);

  async function handleSubscribe() {
    setLoading(true);

    // Save selection so the rest of the site can read it later
    try {
      localStorage.setItem(
        "cbpump_selection",
        JSON.stringify({
          plan: selectedPlan,
          goal: selectedGoal,
          price: PRICE,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {}

    /**
     * This calls your API route:
     *   /pages/api/paypal/create-subscription.js
     *
     * IMPORTANT: Make sure the file is EXACTLY here:
     *   /pages/api/paypal/create-subscription.js
     * (not /pages/pages/api/...)
     */
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          goal: selectedGoal,
          priceGBP: PRICE,
        }),
      });

      // If API isn't created yet, this will fail — we show a helpful message.
      if (!res.ok) {
        const text = await res.text();
        alert(
          "PayPal setup isn’t connected yet.\n\nNext step: we’ll create the /api/paypal/create-subscription endpoint.\n\nDetails:\n" +
            text
        );
        return;
      }

      const data = await res.json();

      // We expect something like: { approvalUrl: "https://www.paypal.com/..." }
      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
        return;
      }

      // Or: { id: "I-XXXX" } for a created subscription (depends on your implementation)
      if (data?.id) {
        alert("Subscription created: " + data.id + "\n(Next we’ll redirect to approval step.)");
        return;
      }

      alert("PayPal response received, but no approval URL was returned.");
    } catch (err) {
      alert(
        "Couldn’t reach the PayPal endpoint yet.\n\nNext step: we’ll add the API file at:\n/pages/api/paypal/create-subscription.js"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Pricing | CBPUMP Coaching</title>
      </Head>

      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>CBPUMP Coaching</h1>
              <p style={styles.subtitle}>
                Choose your level + goal. You’ll get a <strong>4-day/week gym plan</strong>, tailored nutrition guidance,
                and exercise demo videos for every movement.
              </p>
            </div>
            <nav style={styles.nav}>
              <a href="/" style={styles.navLink}>
                Home
              </a>
              <a href="/apply" style={styles.navLink}>
                Apply
              </a>
            </nav>
          </header>

          <section style={styles.topCard}>
            <div>
              <h2 style={styles.h2}>£{PRICE}/month</h2>
              <p style={styles.p}>
                Simple monthly membership. Cancel anytime.
              </p>
            </div>

            <div style={styles.goalBox}>
              <label style={styles.label}>Your goal</label>
              <select
                style={styles.input}
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
              >
                {GOALS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>

              <p style={styles.pSmall}>
                Your goal changes the plan focus (training emphasis + nutrition targets).
              </p>
            </div>
          </section>

          <section style={styles.grid3}>
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlan(p.id)}
                style={{
                  ...styles.planCard,
                  ...(selectedPlan === p.id ? styles.planCardActive : {}),
                }}
              >
                {p.highlight ? <div style={styles.badge}>Most popular</div> : null}
                <h3 style={styles.planName}>{p.name}</h3>
                <p style={styles.planTagline}>{p.tagline}</p>

                <ul style={styles.list}>
                  {p.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p style={styles.pSmall}>
                  <strong>Best for:</strong> {p.bestFor}
                </p>

                <div style={{ marginTop: 10, fontWeight: 800 }}>
                  {selectedPlan === p.id ? "Selected ✓" : "Select"}
                </div>
              </button>
            ))}
          </section>

          <section style={styles.checkout}>
            <div style={styles.checkoutLeft}>
              <h3 style={styles.h3}>Selected</h3>
              <p style={styles.p}>
                <strong>Level:</strong> {plan?.name} <br />
                <strong>Goal:</strong> {GOALS.find((g) => g.id === selectedGoal)?.label} <br />
                <strong>Price:</strong> £{PRICE}/month
              </p>

              <p style={styles.pSmall}>
                If you haven’t completed the onboarding form yet, do that first — it lets CBPUMP tailor the plan to your
                age/height/weight and any injuries.
              </p>
            </div>

            <div style={styles.checkoutRight}>
              <a href="/apply" style={styles.secondaryBtn}>
                Complete / Update Apply Form
              </a>

              <button
                onClick={handleSubscribe}
                style={styles.primaryBtn}
                disabled={loading}
              >
                {loading ? "Opening PayPal..." : "Subscribe with PayPal"}
              </button>

              <p style={styles.pTiny}>
                PayPal integration is the next step. The button will start working once we add the API endpoint file.
              </p>
            </div>
          </section>

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
  container: { maxWidth: 1100, margin: "0 auto" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 18,
  },
  title: { fontSize: 28, margin: 0 },
  subtitle: { marginTop: 8, marginBottom: 0, color: "#444", maxWidth: 720, lineHeight: 1.5 },
  nav: { display: "flex", gap: 12 },
  navLink: { color: "#111", textDecoration: "underline", fontWeight: 700 },

  topCard: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
  },

  h2: { margin: 0, fontSize: 26 },
  h3: { margin: 0, fontSize: 18 },
  p: { marginTop: 8, marginBottom: 0, color: "#333", lineHeight: 1.6 },
  pSmall: { marginTop: 10, marginBottom: 0, color: "#666", fontSize: 13, lineHeight: 1.6 },
  pTiny: { marginTop: 10, marginBottom: 0, color: "#777", fontSize: 12, lineHeight: 1.6 },

  goalBox: { minWidth: 320 },
  label: { display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 14,
  },

  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 },

  planCard: {
    textAlign: "left",
    border: "1px solid #e5e5e5",
    borderRadius: 14,
    padding: 16,
    background: "#fff",
    cursor: "pointer",
  },
  planCardActive: {
    border: "1px solid #111",
    boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
  },
  badge: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #111",
    marginBottom: 10,
  },
  planName: { margin: 0, fontSize: 18, fontWeight: 900 },
  planTagline: { marginTop: 6, marginBottom: 10, color: "#444" },
  list: { margin: 0, paddingLeft: 18, color: "#333", lineHeight: 1.7 },

  checkout: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
  },
  checkoutLeft: { flex: 1 },
  checkoutRight: { display: "flex", flexDirection: "column", gap: 10, minWidth: 320 },

  primaryBtn: {
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
    padding: "12px 14px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-block",
    textAlign: "center",
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
    padding: "12px 14px",
    borderRadius: 10,
    fontWeight: 900,
    cursor: "pointer",
    textDecoration: "none",
  },

  footer: { marginTop: 18, color: "#777", fontSize: 12, textAlign: "center" },
};
