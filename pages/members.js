import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MembersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subId, setSubId] = useState("");

  useEffect(() => {
    const isSubscribed = localStorage.getItem("cbpump_is_subscribed");
    const subscriptionId = localStorage.getItem("cbpump_subscription_id");

    if (isSubscribed !== "true") {
      router.replace("/pricing");
      return;
    }

    setSubId(subscriptionId || "");
    setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: 20 }}>
      <h1>CBPUMP Members Area 💪</h1>
      <p>Welcome! Your membership is active.</p>

      {subId && (
        <p>
          <strong>Your subscription ID:</strong> <code>{subId}</code>
        </p>
      )}

      <button
        style={{ marginTop: 20 }}
        onClick={() => {
          localStorage.removeItem("cbpump_is_subscribed");
          localStorage.removeItem("cbpump_subscription_id");
          router.push("/pricing");
        }}
      >
        Log out (clear local membership)
      </button>
    </main>
  );
}
