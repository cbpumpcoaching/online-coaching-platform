export default function Layout({ children }) {
  return (
    <>
      <header style={styles.header}>
        <h1>Online Coaching Platform</h1>
        <nav>
          <a href="/">Home</a>
          <a href="#services">Services</a>
          <a href="#apply">Apply</a>
        </nav>
      </header>

      <main style={styles.main}>{children}</main>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Online Coaching</p>
      </footer>
    </>
  );
}

const styles = {
  header: {
    padding: '20px 40px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  footer: {
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    marginTop: '60px',
  },
};
