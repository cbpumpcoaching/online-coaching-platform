import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PayPalSuccess() {
  const router = useRouter();
  const { subscription_id } = router.query;

  const [status, setStatus] = useState("Finalising your subscription...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subscription_id) return;

    const confirmSubscription = async () => {
      try {
        const res = await fetch("/api/paypal/confirm-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: subscription_id }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Subscription confirmation failed");
        }

        setStatus("✅ Subscription active! Welcome to CBPUMP.");
      } catch (err) {
        setError(err.message);
        setStatus("❌ Something went wrong");
      }
    };

    confirmSubscription();
  }, [subscription_id]);

  return (
    <main style={{ maxWidth: 600, margin: "80px auto", padding: 20 }}>
      <h1>Payment Successful 🎉</h1>

      <p>
        <strong>Subscription ID:</strong>{" "}
        {subscription_id || "Loading..."}
      </p>

      <p>{status}</p>

      {error && (
        <pre style={{ color: "red", marginTop: 20 }}>{error}</pre>
      )}
    </main>
  );
}
