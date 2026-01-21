// /pages/test-programme.js
import { useState } from "react";
import Link from "next/link";

export default function TestProgrammePage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  async function generate() {
    setError("");
    setDebug("");
    setResult(null);

    const onboarding = {
      goal: "Muscle Gain",
      daysPerWeek: 4,
      experience: "Intermediate",
      equipment: ["gym"],
    };

    localStorage.setItem("cbpump_onboarding", JSON.stringify(onboarding));

    try {
      const res = await fetch("/api/programme/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboarding),
      });

      const text = await res.text(); // read raw response (even if it errors)

      setDebug(`Status: ${res.status}\n\nResponse:\n${text}`);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const programme = JSON.parse(text);
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

      {debug ? (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12, borderRadius: 10 }}>
          {debug}
        </pre>
      ) : null}

      {result ? (
        <div style={{ marginTop: 16 }}>
          <p>✅ Programme generated and saved.</p>
          <p>
            <Link href="/programme">Go to /programme →</Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
