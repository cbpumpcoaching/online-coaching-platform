// /pages/test-programme.js
import { useState } from "react";
import Link from "next/link";

export default function TestProgrammePage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    setResult(null);

    // Fake onboarding data (you can change these values)
    const onboarding = {
      goal: "Muscle Gain",
      daysPerWeek: 4,
      experience: "Intermediate",
      equipment: ["Gym membership (recommended)"],
    };

    // Save onboarding so success page can find it too
    localStorage.setItem("cbpump_onboarding", JSON.stringify(onboarding));

    try {
      const res = await fetch("/api/programme/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboarding),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "API failed");
      }

      const programme = await res.json();
      localStorage.setItem("cbpump_programme_v1", JSON.stringify(programme));
      setResult(programme);
    } catch (e) {
      setError(e.message || "Unknown error");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Test Programme Generator</h1>

      <button
        onClick={generate}
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid #000",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Generate Test Programme
      </button>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid red", borderRadius: 10 }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {result ? (
        <div style={{ marginTop: 16 }}>
          <p>✅ Programme generated and saved to localStorage.</p>
          <p>
            <Link href="/programme">Go to /programme →</Link>
          </p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12, borderRadius: 10 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
