export default function Home() {
  return (
    <div style={{ padding: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1>Online Coaching Platform</h1>
        <p>Your transformation starts here.</p>
      </header>

      <main>
        <section style={{ marginBottom: '32px' }}>
          <h2>What I Offer</h2>
          <ul>
            <li>1:1 Online Coaching</li>
            <li>Custom Training Plans</li>
            <li>Nutrition Guidance</li>
          </ul>
        </section>

        <section>
          <h2>Get Started</h2>
          <button>Apply Now</button>
        </section>
      </main>
    </div>
  );
}
