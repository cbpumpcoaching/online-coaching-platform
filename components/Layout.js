export default function Layout({ children }) {
  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>CBPUMP</div>

          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/pricing" style={styles.navLink}>Pricing</a>
            <a href="/#services" style={styles.navLink}>Services</a>
            <a href="/apply" style={styles.navLink}>Apply</a>
          </nav>
        </div>
      </header>

      <main style={styles.main}>{children}</main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} CBPUMP</p>
      </footer>
    </>
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
    fontWeight: 800,
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    gap: 18,
    fontSize: 16,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  navLink: {
    textDecoration: "none",
    fontWeight: 500,
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "60px 20px",
  },
  footer: {
    borderTop: "1px solid #eee",
    padding: "30px 20px",
    textAlign: "center",
    marginTop: 60,
  },
  footerText: {
    margin: 0,
    color: "#333",
  },
};
