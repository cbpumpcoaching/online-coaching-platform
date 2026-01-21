import { useState } from "react";

export default function Apply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    goal: "",
    experience: "",
    daysPerWeek: "",
    equipment: [], // ✅ array of selected equipment
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleEquipment(value) {
    setForm((prev) => {
      const exists = prev.equipment.includes(value);
      return {
        ...prev,
        equipment: exists
          ? prev.equipment.filter((x) => x !== value)
          : [...prev.equipment, value],
      };
    });
  }

  // ✅ Map your form goal values to the generator/template goal names
  function mapGoalToTemplate(goalValue) {
    if (goalValue === "muscle_gain") return "Muscle Gain";
    if (goalValue === "fat_loss") return "Fat Loss";
    if (goalValue === "fitness") return "Improve Overall Fitness";
    return "Muscle Gain"; // default fallback
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      const payload = {
        ...form,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          state: "error",
          message:
            data?.webhookResponse ||
            data?.details ||
            data?.error ||
            "Submission failed",
        });
        return;
      }

      // ✅ Save onboarding for programme generation (PayPal success + /programme)
      const onboardingForProgramme = {
        goal: mapGoalToTemplate(form.goal),
        experience: form.experience, // beginner/intermediate/advanced
        daysPerWeek: Number(form.daysPerWeek), // make sure it's a number
        equipment: form.equipment, // ["gym","dumbbells","bands","bodyweight"]
        name: form.name,
        email: form.email,
      };

      localStorage.setItem(
        "cbpump_onboarding",
        JSON.stringify(onboardingForProgramme)
      );

      setStatus({ state: "success", message: "Application submitted ✅" });

      // optional: clear form after success
      setForm({
        name: "",
        email: "",
        goal: "",
        experience: "",
        daysPerWeek: "",
        equipment: [],
      });
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Coaching Application
        </h1>

        <p style={{ marginBottom: "30px" }}>
          Complete the form below to apply for personalised online coaching with CBPUMP.
        </p>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* EMAIL */}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* GOAL */}
          <label>Main Goal</label>
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
          <label>Training Experience</label>
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
          <label>How many days per week can you train?</label>
          <select
            name="daysPerWeek"
            value={form.daysPerWeek}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select one</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
            <option value="6">6 days</option>
          </select>

          {/* EQUIPMENT */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              What equipment do you have access to?
            </label>

            <div style={checkboxWrap}>
              <EquipmentCheckbox
                label="Gym membership (recommended)"
                value="gym"
                checked={form.equipment.includes("gym")}
                onChange={toggleEquipment}
              />
              <EquipmentCheckbox
                label="Dumbbells"
                value="dumbbells"
                checked={form.equipment.includes("dumbbells")}
                onChange={toggleEquipment}
              />
              <EquipmentCheckbox
                label="Resistance bands"
                value="bands"
                checked={form.equipment.includes("bands")}
                onChange={toggleEquipment}
              />
              <EquipmentCheckbox
                label="Bodyweight only"
                value="bodyweight"
                checked={form.equipment.includes("bodyweight")}
                onChange={toggleEquipment}
              />
            </div>

            <p style={{ marginTop: "8px", color: "#555", fontSize: "14px" }}>
              Tip: If you can, a gym membership gives you the best results and the most variety.
            </p>
          </div>

          <button type="submit" style={buttonStyle} disabled={status.state === "loading"}>
            {status.state === "loading" ? "Submitting..." : "Submit Application"}
          </button>

          {status.state === "success" && (
            <p style={{ marginTop: "16px", color: "green" }}>{status.message}</p>
          )}
          {status.state === "error" && (
            <p style={{ marginTop: "16px", color: "crimson" }}>
              Something went wrong: {status.message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

function EquipmentCheckbox({ label, value, checked, onChange }) {
  return (
    <label style={checkboxItem}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(value)}
        style={{ marginRight: "10px" }}
      />
      {label}
    </label>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "20px",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "14px",
  width: "100%",
  backgroundColor: "#000",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const checkboxWrap = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "10px",
};

const checkboxItem = {
  display: "flex",
  alignItems: "center",
  padding: "6px 0",
};
