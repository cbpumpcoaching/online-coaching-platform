export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 56, marginBottom: 10 }}>Transform Your Body</h1>

      <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>
        Personalised online coaching by <strong>CBPUMP</strong> to help you build
        strength, confidence, and long-term consistency.
      </p>

      <section style={{ marginTop: 50 }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>What’s Included</h2>
        <ul style={{ fontSize: 18, lineHeight: 1.9 }}>
          <li>4-day gym training plans</li>
          <li>Beginner, Intermediate & Advanced levels</li>
          <li>Muscle gain, fat loss or fitness goals</li>
          <li>Dietary advice tailored to you</li>
          <li>Exercise demo videos for every movement</li>
          <li>Monthly check-ins & progress tracking</li>
        </ul>
      </section>

      <section style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Apply Now</h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>
          Choose your level, set your goal, and receive a fully personalised
          training and nutrition plan.
        </p>

        <a
          href="/apply"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "12px 18px",
            border: "1px solid #111",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Go to Apply Form →
        </a>
      </section>
    </main>
  );
}
