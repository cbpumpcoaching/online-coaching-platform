import { useState } from "react";

export default function Apply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    goal: "",
    experience: "",
    availability: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Application submitted! (This will connect to payments next)");
    console.log(form);
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* HEADER */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #eee",
        }}
      >
        <h2 style={{ margin: 0 }}>CBPUMP Coaching</h2>
      </header>

      {/* FORM */}
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Coaching Application
        </h1>

        <p style={{ marginBottom: "30px" }}>
          Complete the form below to apply for personalised online coaching
          with CBPUMP.
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

          {/* AVAILABILITY */}
          <label>How many days per week can you train?</label>
          <input
            type="text"
            name="availability"
            value={form.availability}
            onChange={handleChange}
            placeholder="e.g. 3–5 days"
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "14px",
              width: "100%",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Application
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
