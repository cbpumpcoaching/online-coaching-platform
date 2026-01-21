// /pages/programme.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProgrammePage() {
  const [programme, setProgramme] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cbpump_programme_v1");
      if (raw) setProgramme(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!programme) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
        <h1>Your Programme</h1>
        <p>No programme found yet.</p>
        <p>
          Go to <Link href="/test-programme">/test-programme</Link> to generate a test one, then come back here.
        </p>
      </div>
    );
  }

  const week1 = programme.weeks && programme.weeks[0];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Your Programme</h1>

      <p>
        <strong>Goal:</strong> {programme.input?.goal} &nbsp;|&nbsp; <strong>Days:</strong>{" "}
        {programme.input?.daysPerWeek} &nbsp;|&nbsp; <strong>Level:</strong> {programme.input?.level} &nbsp;|&nbsp;{" "}
        <strong>Equipment:</strong> {programme.input?.tier}
      </p>

      <hr />

      <h2>Week {week1?.weekNumber || 1}</h2>

      {week1?.days?.map((day) => (
        <div
          key={day.dayNumber}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3>
            Day {day.dayNumber}: {day.name}
          </h3>

          <ol>
            {day.exercises.map((ex) => (
              <li key={ex.order} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{ex.name}</div>
                <div>
                  <strong>Sets:</strong> {ex.prescription.sets} &nbsp;|&nbsp; <strong>Reps:</strong>{" "}
                  {ex.prescription.reps} &nbsp;|&nbsp; <strong>Rest:</strong> {ex.prescription.rest}
                </div>
                <div style={{ opacity: 0.8 }}>{ex.prescription.notes}</div>
              </li>
            ))}
          </ol>
        </div>
      ))}

      <p style={{ marginTop: 20 }}>
        <Link href="/test-programme">Generate a test programme</Link>
      </p>
    </div>
  );
}
