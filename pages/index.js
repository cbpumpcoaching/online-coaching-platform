export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* NAVBAR */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>CBPUMP</h2>

        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ textDecoration: "none", color: "#000" }}>Home</a>
          <a href="/pricing" style={{ textDecoration: "none", color: "#000" }}>Services</a>
          <a href="/apply" style={{ textDecoration: "none", color: "#000" }}>Apply</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Transform Your Body
        </h1>

        <p style={{ fontSize: "18px", maxWidth: "600px", marginBottom: "40px" }}>
          Personalised online coaching by <strong>CBPUMP</strong> to help you
          build strength, confidence, and long-term consistency.
        </p>

        {/* WHAT'S INCLUDED */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
            What’s Included
          </h2>

          <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
            <li>4-day gym training plans</li>
            <li>Beginner, Intermediate & Advanced levels</li>
            <li>Muscle gain, fat loss or fitness goals</li>
            <li>Dietary advice tailored to you</li>
            <li>Exercise demo videos for every movement</li>
            <li>Monthly check-ins & progress tracking</li>
          </ul>
        </section>

        {/* APPLY CTA */}
        <section>
          <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
            Apply Now
          </h2>

          <p style={{ fontSize: "16px", maxWidth: "600px", marginBottom: "20px" }}>
            Choose your level, set your goal, and receive a fully personalised
            training and nutrition plan from CBPUMP.
          </p>

          <a
            href="/apply"
            style={{
              display: "inline-block",
              padding: "14px 24px",
              backgroundColor: "#000",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Start Your Journey
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #eee",
          padding: "20px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} CBPUMP Coaching
      </footer>
    </div>
  );
}
