import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PayPalSuccess() {
  const router = useRouter();
  const { subscription_id } = router.query;

  const [status, setStatus] = useState("Finalising your subscription...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!subscription_id) {
      setStatus("Missing subscription_id. Please complete checkout first.");
      return;
    }

    const confirm = async () => {
      try {
        const res = await fetch("/api/paypal/confirm-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: subscription_id }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Confirmation failed");

        // ✅ Save “membership” locally (simple)
        localStorage.setItem("cbpump_subscription_id", subscription_id);
        localStorage.setItem("cbpump_is_subscribed", "true");

        setStatus("✅ Subscription confirmed! Redirecting...");

        // Redirect to members area
        setTimeout(() => {
          router.push("/members");
        }, 800);
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
    </main>
  );
}
