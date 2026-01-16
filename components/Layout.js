export default function Layout({ children }) {
  return (
    <>
      <header style={styles.header}>
        <h1 style={styles.logo}>CBPUMP</h1>

        <nav style={styles.nav}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/#services" style={styles.link}>Services</a>
          <a href="/apply" style={styles.link}>Apply</a>
        </nav>
      </header>

      <main style={styles.main}>{children}</main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} CBPUMP
      </footer>
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 48px",
    borderBottom: "1px solid #eee",
  },
  logo: {
    fontSize: "26px",
    margin: 0,
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    fontWeight: 500,
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "64px 24px",
  },
  footer: {
    textAlign: "center",
    padding: "24px",
    borderTop: "1px solid #eee",
    marginTop: "64px",
  },
};
