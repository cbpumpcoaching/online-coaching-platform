import { useState } from "react";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startSubscription = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non-JSON: ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      window.location.href = data.approvalUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>CBPUMP Monthly Coaching</h1>
      <p>£30/month — cancel anytime</p>

      <button onClick={startSubscription} disabled={loading}>
        {loading ? "Opening PayPal…" : "Subscribe with PayPal"}
      </button>

      {error ? (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#111",
            color: "#0f0",
            overflowX: "auto",
          }}
        >
          {error}
        </pre>
      ) : null}
    </main>
  );
}
