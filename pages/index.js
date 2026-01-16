import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Transform Your Body</h2>
        <p style={styles.heroText}>
          Personalised online coaching to help you build strength, confidence,
          and consistency.
        </p>
      </section>

      <section id="services" style={styles.section}>
        <h3 style={styles.sectionTitle}>What’s Included</h3>
        <ul style={styles.list}>
          <li>4-day gym training plans</li>
          <li>Beginner, Intermediate & Advanced levels</li>
          <li>Muscle gain, fat loss or fitness goals</li>
          <li>Dietary advice tailored to you</li>
          <li>Exercise demo videos for every movement</li>
          <li>Monthly check-ins & progress tracking</li>
        </ul>
      </section>

      <section id="apply" style={styles.section}>
        <h3 style={styles.sectionTitle}>Apply Now</h3>
        <p style={styles.text}>
          Choose your level, set your goal, and receive a fully personalised
          training and nutrition plan.
        </p>
        <button style={styles.button}>Start Your Journey</button>
      </section>
    </Layout>
  );
}

const styles = {
  hero: {
    marginBottom: "72px",
  },
  heroTitle: {
    fontSize: "44px",
    marginBottom: "16px",
  },
  heroText: {
    fontSize: "18px",
    lineHeight: 1.6,
  },
  section: {
    marginBottom: "64px",
  },
  sectionTitle: {
    fontSize: "28px",
    marginBottom: "12px",
  },
  list: {
    lineHeight: 1.8,
    paddingLeft: "20px",
  },
  text: {
    marginBottom: "16px",
  },
  button: {
   <a href="/apply">
  <button style={styles.button}>Start Your Journey</button>
</a>
  },
};
