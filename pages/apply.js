import { useMemo, useState } from "react";

const EQUIPMENT_OPTIONS = [
  { value: "full_gym", label: "Gym membership / Full gym (recommended)" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "bands", label: "Resistance bands" },
  { value: "kettlebells", label: "Kettlebells" },
  { value: "bodyweight_only", label: "Bodyweight only" },
];

function normalizeEquipment(selected) {
  const set = new Set(selected);

  const hasNonBodyweight =
    set.has("full_gym") || set.has("dumbbells") || set.has("bands") || set.has("kettlebells");

  if (hasNonBodyweight) set.delete("bodyweight_only");
  if (set.size === 0) set.add("bodyweight_only");

  return Array.from(set);
}

export default function Apply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    goal: "",
    experience: "",
    daysPerWeek: 3,
    equipment: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const normalizedEquipment = useMemo(
    () => normalizeEquipment(form.equipment),
    [form.equipment]
  );

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "daysPerWeek") {
      setForm((prev) => ({ ...prev, daysPerWeek: Number(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleEquipment(value) {
    setForm((prev) => {
      const next = new Set(prev.equipment);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, equipment: Array.from(next) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // quick validation
    if (!form.name.trim() || !form.email.trim() || !form.goal || !form.experience) {
      setMessage("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          equipment: normalizedEquipment,
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setMessage("✅ Application submitted! (Saved in server logs for now.)");

      // Optional redirect after submit:
      // window.location.href = "/pricing";
    } catch (err) {
      setMessage(`❌ ${err.message || "Submission failed."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* HEADER */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid #eee" }}>
        <h2 style={{ margin: 0 }}>CBPUMP Coaching</h2>
      </header>

      {/* FORM */}
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Coaching Application</h1>

        <p style={{ marginBottom: "30px" }}>
          Complete the form below to apply for personalised online coaching with CBPUMP.
        </p>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* EMAIL */}
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* GOAL */}
          <label>Main Goal *</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select one</option>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="fitness">General Fitness</option>
          </select>

          {/* EXPERIENCE */}
          <label>Training Experience *</label>
          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select one</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* DAYS PER WEEK */}
          <label>How many days per week can you train? *</label>
          <select
            name="daysPerWeek"
            value={form.daysPerWeek}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value={2}>2 days</option>
            <option value={3}>3 days</option>
            <option value={4}>4 days</option>
            <option value={5}>5 days</option>
            <option value={6}>6 days</option>
          </select>

          {/* EQUIPMENT */}
          <div style={cardStyle}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Equipment available (select all that apply)
            </label>
            <p style={{ marginTop: 0, marginBottom: 14, color: "#666" }}>
              Best results typically come with gym access, but we’ll build a plan with whatever you have.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              {EQUIPMENT_OPTIONS.map((opt) => {
                const checked = form.equipment.includes(opt.value);
                const recommended = opt.value === "full_gym";

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleEquipment(opt.value)}
                    style={{
                      textAlign: "left",
                      padding: 14,
                      borderRadius: 10,
                      border: checked ? "2px solid #000" : "1px solid #ccc",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: checked ? "2px solid #000" : "1px solid #aaa",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                        }}
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <span style={{ fontWeight: 600 }}>{opt.label}</span>
                    </span>

                    {recommended ? (
                      <span
                        style={{
                          fontSize: 12,
                          border: "1px solid #ddd",
                          padding: "4px 8px",
                          borderRadius: 999,
                          color: "#333",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Recommended
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
              Selected: <code>{JSON.stringify(normalizedEquipment)}</code>
            </div>
          </div>

          {message ? (
            <div
              style={{
                marginTop: 10,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fafafa",
              }}
            >
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "14px",
              width: "100%",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  marginTop: "5px",
  border: "1px solid #ccc",
};

const cardStyle = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 16,
  marginTop: 10,
  marginBottom: 10,
};
