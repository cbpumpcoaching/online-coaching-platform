import Layout from "../components/Layout";

export default function Pricing() {
  return (
    <Layout>
      <section style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 46, margin: 0 }}>Pricing</h1>
        <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
          £30/month paid via PayPal. Choose your level, choose your goal, and get
          a 4-day training plan + dietary advice + exercise video library + monthly check-ins.
        </p>
      </section>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Beginner</h2>
          <p style={styles.cardText}>
            Perfect if you’re new to the gym or need structure and consistency.
          </p>
          <ul style={styles.list}>
            <li>4 days/week training plan</li>
            <li>Technique + progression focus</li>
            <li>Simple nutrition targets</li>
          </ul>
          <a href="/apply" style={{ textDecoration: "none" }}>
            <button style={styles.button}>Apply (Beginner)</button>
          </a>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Intermediate</h2>
          <p style={styles.cardText}>
            For consistent lifters who want better results and progression.
          </p>
          <ul style={styles.list}>
            <li>4 days/week training plan</li>
            <li>More volume + clear progression</li>
            <li>Nutrition targets + adjustments</li>
          </ul>
          <a href="/apply" style={{ textDecoration: "none" }}>
            <button style={styles.button}>Apply (Intermediate)</button>
          </a>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Advanced</h2>
          <p style={styles.cardText}>
            For experienced lifters chasing performance + physique.
          </p>
          <ul style={styles.list}>
            <li>4 days/week training plan</li>
            <li>Higher-quality volume + tracking</li>
            <li>Goal-based cardio + nutrition</li>
          </ul>
          <a href="/apply" style={{ textDecoration: "none" }}>
            <button style={styles.button}>Apply (Advanced)</button>
          </a>
        </div>
      </div>

      <section style={styles.paypalBox}>
        <h2 style={{ margin: 0 }}>PayPal Subscription</h2>
        <p style={{ marginTop: 10 }}>
          Next step we’ll add a real PayPal £30/month subscription button and lock
          member-only content until payment is active.
        </p>

        <button
          style={styles.buttonAlt}
          onClick={() => alert("Next step: Add PayPal subscription checkout + payment verification.")}
        >
          Pay £30/month (PayPal) — coming next
        </button>
      </section>
    </Layout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
    marginTop: 40,
  },
  card: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 18,
  },
  cardTitle: {
    margin: 0,
    fontSize: 22,
  },
  cardText: {
    marginTop: 10,
    marginBottom: 12,
    lineHeight: 1.5,
  },
  list: {
    margin: 0,
    paddingLeft: 20,
    lineHeight: 1.8,
  },
  button: {
    width: "100%",
    marginTop: 14,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 16px",
    fontSize: 15,
    cursor: "pointer",
  },
  paypalBox: {
    marginTop: 40,
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 18,
    textAlign: "center",
  },
  buttonAlt: {
    marginTop: 10,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 16px",
    fontSize: 15,
    cursor: "pointer",
  },
};
