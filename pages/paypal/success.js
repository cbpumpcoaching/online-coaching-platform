import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PayPalSuccess() {
  const router = useRouter();
  const { subscription_id, ba_token, token } = router.query;

  const [status, setStatus] = useState("Waiting for subscription ID...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    // If user manually visits /paypal/success without PayPal redirect params
    if (!subscription_id) {
      setStatus("Missing subscription_id. Please complete checkout first.");
      return;
    }

    const confirm = async () => {
      try {
        setStatus("Finalising your subscription...");

        const res = await fetch("/api/paypal/confirm-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: subscription_id }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || "Subscription confirmation failed");
        }

        setStatus("✅ Subscription confirmed! You’re all set.");
      } catch (err) {
        setError(err.message || "Something went wrong");
        setStatus("❌ Could not confirm subscription.");
      }
    };

    confirm();
  }, [router.isReady, subscription_id]);

  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: 20 }}>
      <h1>Success ✅</h1>
      <p>{status}</p>

      {subscription_id && (
        <p>
          <strong>subscription_id:</strong> <code>{subscription_id}</code>
        </p>
      )}

      {error && (
        <p style={{ marginTop: 16 }}>
          <strong>Error:</strong> <code>{error}</code>
        </p>
      )}

      <details style={{ marginTop: 16 }}>
        <summary>Debug info (optional)</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>
{JSON.stringify({ subscription_id, ba_token, token }, null, 2)}
        </pre>
      </details>
    </main>
  );
}
