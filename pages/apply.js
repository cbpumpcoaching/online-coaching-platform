export default function Apply() {
  return (
    <div>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>Online Coaching Platform</div>

          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/#services" style={styles.navLink}>Services</a>
            <a href="/apply" style={styles.navLink}>Apply</a>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>Apply</h1>
        <p style={styles.subtitle}>
          Fill this out and I’ll get back to you with next steps.
        </p>

        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label style={styles.label}>
            Full Name
            <input style={styles.input} type="text" name="name" placeholder="Your name" required />
          </label>

          <label style={styles.label}>
            Email
            <input style={styles.input} type="email" name="email" placeholder="you@example.com" required />
          </label>

          <label style={styles.label}>
            Goal
            <select style={styles.input} name="goal" defaultValue="fat-loss">
              <option value="fat-loss">Fat loss</option>
              <option value="muscle-gain">Muscle gain</option>
              <option value="fitness">General fitness</option>
              <option value="strength">Strength</option>
            </select>
          </label>

          <label style={styles.label}>
            Training Experience
            <select style={styles.input} name="experience" defaultValue="beginner">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          <label style={styles.label}>
            Anything you want me to know?
            <textarea
              style={styles.textarea}
              name="notes"
              rows={5}
              placeholder="Injuries, schedule, preferences, etc."
            />
          </label>

          <button style={styles.button} type="submit">
            Submit Application
          </button>

          <p style={styles.note}>
            (This is a simple demo form right now — next we can connect it to email / a database.)
          </p>
        </form>
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
    maxWidth: 700,
    margin: "0 auto",
    padding: "60px 20px",
  },
  title: {
    fontSize: 44,
    margin: 0,
    lineHeight: 1.1,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 14,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: "center",
  },
  form: {
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    resize: "vertical",
  },
  button: {
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 16px",
    fontSize: 16,
    cursor: "pointer",
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    color: "#555",
    textAlign: "center",
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
