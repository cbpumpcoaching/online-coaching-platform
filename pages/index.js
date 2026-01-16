import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section style={{ marginBottom: '48px' }}>
        <h2>Transform Your Body</h2>
        <p>
          Personalised online coaching to help you build strength,
          confidence, and consistency.
        </p>
      </section>

      <section id="services" style={{ marginBottom: '48px' }}>
        <h2>What’s Included</h2>
        <ul>
          <li>1:1 Coaching</li>
          <li>Custom Training Plans</li>
          <li>Nutrition Guidance</li>
          <li>Weekly Check-ins</li>
        </ul>
      </section>

      <section id="apply">
        <h2>Apply Now</h2>
        <button>Start Your Journey</button>
      </section>
    </Layout>
  );
}
