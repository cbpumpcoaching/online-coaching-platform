import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>CBPUMP Online Coaching</h1>
        <p style={styles.heroText}>
          Personalised online coaching to help you build strength, confidence, and consistency.
        </p>

        <div style={{ marginTop: 18 }}>
          <a href="/apply" style={{ textDecoration: "none" }}>
            <button style={styles.button}>Apply Now</button>
          </a>
        </div>
      </section>

      <section id="services" style={styles.section}>
        <h2 style={styles.sectionTitle}>What’s Included</h2>
        <ul style={styles.list}>
          <li>4-day gym training plans</li>
          <li>Beginner, Intermediate &amp; Advanced levels</li>
          <li>Muscle gain, fat loss or fitness goals</li>
          <li>Dietary advice tailored to you</li>
          <li>Exercise demo videos for every movement</li>
          <li>Monthly check-ins &amp; progress tracking</li>
        </ul>
      </section>

      <section id="apply" style={styles.section}>
        <h2 style={styles.sectionTitle}>Start Your Journey</h2>
        <p style={styles.paragraph}>
          Choose your level, set your goal, and receive a personalised training and nutrition plan.
        </p>
        <a href="/apply" style={{ textDecoration: "none" }}>
          <button style={styles.button}>Get Started</button>
        </a>
      </section>
    </Layout>
  );
}

const styles = {
  hero: {
    marginBottom: 60,
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 56,
    margin: 0,
    lineHeight: 1.05,
  },
  heroText: {
    marginTop: 16,
    fontSize: 18,
    lineHeight: 1.5,
    maxWidth: 650,
    marginLeft: "auto",
    marginRight: "auto",
  },
  section: {
    marginTop: 50,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 28,
    marginBottom: 14,
  },
  list: {
    display: "inline-block",
    textAlign: "left",
    lineHeight: 1.8,
    fontSize: 16,
    margin: 0,
    paddingLeft: 20,
  },
  paragraph: {
    maxWidth: 650,
    margin: "0 auto 16px auto",
    fontSize: 16,
    lineHeight: 1.5,
  },
  button: {
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 20px",
    fontSize: 16,
    cursor: "pointer",
  },
};
