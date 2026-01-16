export default function Home() {
  return (
    <div>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>Online Coaching Platform</div>

          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="#services" style={styles.navLink}>Services</a>
            <a href="/apply" style={styles.navLink}>Apply</a>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Transform Your Body</h1>
          <p style={styles.heroText}>
            Personalised online coaching to help you build strength, confidence, and consistency.
          </p>
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

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Apply Now</h2>
          <p style={styles.paragraph}>
            Choose your level, set your goal, and receive a personalised training and nutrition plan.
          </p>

          <a href="/apply" style={styles.buttonLink}>
            <button style={styles.button}>Start Your Journey</button>
          </a>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Online Coaching</p>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    borderBottom: "1px solid #eee",
    background: "#fff",
  },
  headerInner: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    gap: 18,
    fontSize: 16,
  },
  navLink: {
    textDecoration: "none",
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "60px 20px",
  },
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
  buttonLink: {
    textDecoration: "none",
  },
  button: {
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "12px 20px",
    fontSize: 16,
  },
  footer: {
    borderTop: "1px solid #eee",
    padding: "30px 20px",
    textAlign: "center",
  },
  footerText: {
    margin: 0,
    color: "#333",
  },
};
