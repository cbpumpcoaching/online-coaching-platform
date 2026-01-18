import { useRouter } from "next/router";

export default function PayPalSuccess() {
  const router = useRouter();
  const { subscription_id, ba_token, token } = router.query;

  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: 20 }}>
      <h1>Success ✅</h1>
      <p>Your PayPal subscription was approved.</p>

      <p>
        <strong>subscription_id:</strong>{" "}
        <code>{subscription_id || "Loading..."}</code>
      </p>

      <details style={{ marginTop: 16 }}>
        <summary>Debug info (optional)</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>
{JSON.stringify({ subscription_id, ba_token, token }, null, 2)}
        </pre>
      </details>

      <p style={{ marginTop: 24 }}>
        You can close this page now.
      </p>
    </main>
  );
}
