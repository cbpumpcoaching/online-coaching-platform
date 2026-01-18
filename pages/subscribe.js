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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create subscription");
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

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
