// /pages/test-programme.js
import { useState } from "react";
import Link from "next/link";

export default function TestProgrammePage() {
  const [debug, setDebug] = useState("");
  const [ok, setOk] = useState(false);

  async function generate() {
    setOk(false);
    setDebug("Calling API...");

    const onboarding = {
      goal: "Muscle Gain",
      daysPerWeek: 4,
      experience: "intermediate",
      equipment: ["gym"],
    };

    try {
      const res = await fetch("/api/programme/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboarding),
      });

      const text = await res.text();

      // Try parse JSON (your API returns JSON even on error)
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { nonJsonResponse: text };
      }

      setDebug(`Status: ${res.status}\n\nResponse:\n${JSON.stringify(parsed, null, 2)}`);

      if (!res.ok) return;

      localStorage.setItem("cbpump_programme_v1", JSON.stringify(parsed));
      localStorage.setItem("cbpump_onboarding", JSON.stringify(onboarding));
      setOk(true);
    } catch (e) {
      setDebug(`Client error:\n${e?.message || String(e)}`);
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

      {ok ? (
        <p style={{ marginTop: 12 }}>
          ✅ Saved! <Link href="/programme">Go to /programme →</Link>
        </p>
      ) : null}

      <pre
        style={{
          marginTop: 16,
          whiteSpace: "pre-wrap",
          background: "#f6f6f6",
          padding: 12,
          borderRadius: 10,
        }}
      >
        {debug}
      </pre>
    </div>
  );
}
