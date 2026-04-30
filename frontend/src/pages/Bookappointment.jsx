import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { doctorAPI, appointmentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .page { min-height: 100vh; padding-top: 70px; }
  .content { max-width: 800px; margin: 0 auto; padding: 36px 24px 60px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: #102033; margin-bottom: 6px; }
  .page-sub { font-size: 14px; color: #5f6f87; margin-bottom: 32px; }

  .step-indicator { display: flex; align-items: center; margin-bottom: 36px; }
  .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; transition: all 0.2s; flex-shrink: 0; }
  .step-dot.done   { background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; box-shadow: 0 4px 12px rgba(15,157,116,0.28); }
  .step-dot.active { background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; box-shadow: 0 4px 12px rgba(15,157,116,0.28); }
  .step-dot.idle   { background: rgba(15,23,42,0.06); color: #5f6f87; }
  .step-line { flex: 1; height: 2px; background: rgba(15,23,42,0.08); margin: 0 8px; }
  .step-line.done  { background: linear-gradient(90deg,#0f9d74,#2f8fb6); }
  .step-label { font-size: 11px; font-weight: 600; color: #5f6f87; margin-top: 4px; text-align: center; }

  .card { background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.07); border-radius: 22px; padding: 30px; box-shadow: 0 6px 24px rgba(15,23,42,0.07); margin-bottom: 20px; }
  .card-title { font-size: 16px; font-weight: 700; color: #102033; margin-bottom: 20px; }

  .dept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: 10px; }
  .dept-item {
    border: 1.5px solid rgba(15,23,42,0.09); border-radius: 14px; padding: 16px 12px;
    text-align: center; cursor: pointer; transition: all 0.18s; background: rgba(255,255,255,0.80);
  }
  .dept-item:hover, .dept-item.selected { background: rgba(15,157,116,0.08); border-color: rgba(15,157,116,0.30); }
  .dept-item .di { font-size: 28px; margin-bottom: 6px; display: block; }
  .dept-item span { font-size: 12px; font-weight: 600; color: #102033; }

  .doc-grid { display: flex; flex-direction: column; gap: 10px; }
  .doc-item {
    display: flex; align-items: center; gap: 14px; padding: 14px 16px;
    border: 1.5px solid rgba(15,23,42,0.09); border-radius: 14px;
    cursor: pointer; transition: all 0.18s; background: rgba(255,255,255,0.80);
  }
  .doc-item:hover, .doc-item.selected { background: rgba(15,157,116,0.08); border-color: rgba(15,157,116,0.30); }
  .doc-av { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .doc-info h4 { font-size: 14px; font-weight: 700; color: #102033; }
  .doc-info p  { font-size: 12px; color: #5f6f87; }
  .doc-rating  { margin-left: auto; font-size: 12px; color: #f59e0b; font-weight: 600; }

  .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px,1fr)); gap: 8px; }
  .slot {
    padding: 10px; border-radius: 10px; border: 1.5px solid rgba(15,23,42,0.09);
    text-align: center; font-size: 13px; font-weight: 500; color: #5f6f87;
    cursor: pointer; transition: all 0.15s; background: rgba(255,255,255,0.80);
  }
  .slot:hover, .slot.selected { background: rgba(15,157,116,0.10); border-color: rgba(15,157,116,0.30); color: #0f9d74; font-weight: 700; }
  .slot.disabled { opacity: 0.4; cursor: not-allowed; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #102033; margin-bottom: 7px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.12); background: rgba(255,255,255,0.90);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #102033;
    outline: none; transition: border-color 0.18s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #0f9d74; }
  .form-textarea { resize: vertical; min-height: 80px; }

  .nav-btns { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  .btn-back { padding: 12px 26px; border-radius: 11px; border: 1.5px solid rgba(15,23,42,0.10); background: transparent; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:#5f6f87; cursor:pointer; transition:all 0.18s; }
  .btn-next { padding: 12px 28px; border-radius: 11px; border: none; background: linear-gradient(135deg,#0f9d74,#2f8fb6); color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; box-shadow:0 5px 16px rgba(15,157,116,0.22); transition:all 0.18s; }
  .btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,157,116,0.28); }
  .btn-next:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .success-state { text-align: center; padding: 40px 24px; }
  .success-state .tick { font-size: 56px; margin-bottom: 16px; animation: pop 0.4s ease; }
  @keyframes pop { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
  .success-state h2 { font-family: 'DM Serif Display', serif; font-size: 26px; color: #102033; margin-bottom: 8px; }
  .success-state p { color: #5f6f87; font-size: 14px; margin-bottom: 24px; }
  
  .alert-error { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #b42318; margin-bottom: 18px; }
`;
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

const DEPTS = [
  { icon: "🩺", name: "General" },
  { icon: "🫀", name: "Cardiology" },
  { icon: "🧠", name: "Neurology" },
  { icon: "🦷", name: "Dental" },
  { icon: "👶", name: "Pediatrics" },
  { icon: "🦴", name: "Orthopedics" },
  { icon: "👁️", name: "Eye Care" },
  { icon: "🔬", name: "Pathology" },
];

const SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

export default function BookAppointment() {
  injectCSS("book-css", CSS);
  const navigate = useNavigate();
  const { } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [sel, setSel] = useState({
    dept: "",
    doctor: null,
    slot: "",
    date: "",
    reason: "",
  });

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getDoctors();
        if (response.success) {
          setAllDoctors(response.doctors || []);
        }
      } catch (err) {
        setError("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Filter doctors by department
  const doctors = allDoctors.filter(
    (d) => d.specialization && d.specialization.toLowerCase() === sel.dept.toLowerCase()
  );

  const confirm = async () => {
    if (!sel.doctor || !sel.date || !sel.slot || !sel.reason) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await appointmentAPI.bookAppointment({
        doctorId: sel.doctor._id,
        appointmentDate: sel.date,
        appointmentTime: sel.slot,
        reason: sel.reason,
      });

      if (response.success) {
        setStep(4);
      } else {
        setError(response.message || "Failed to book appointment");
      }
    } catch (err) {
      setError(err.message || "An error occurred while booking");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Department", "Doctor", "Time Slot", "Details"];

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <h1 className="page-title">Book Appointment</h1>
        <p className="page-sub">Follow the steps to schedule your visit</p>

        {error && <div className="alert-error">⚠️ {error}</div>}

        {step < 4 && (
          <div className="step-indicator" style={{ flexWrap:"wrap", gap:4 }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center" }}>
                  <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "idle"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} style={{ width:40 }} />}
                </div>
                <span className="step-label">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 0: Department */}
        {step === 0 && (
          <div className="card">
            <div className="card-title">Select Department</div>
            <div className="dept-grid">
              {DEPTS.map(d => (
                <div key={d.name} className={`dept-item${sel.dept===d.name?" selected":""}`} onClick={() => setSel(s=>({...s,dept:d.name,doctor:null}))}>
                  <span className="di">{d.icon}</span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
            <div className="nav-btns">
              <button className="btn-next" disabled={!sel.dept} onClick={() => setStep(1)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 1: Doctor */}
        {step === 1 && (
          <div className="card">
            <div className="card-title">Choose a Doctor — {sel.dept}</div>
            {doctors.length === 0 ? (
              <p style={{ color: "#5f6f87" }}>No doctors available in this specialization</p>
            ) : (
              <div className="doc-grid">
                {doctors.map((d) => (
                  <div
                    key={d._id}
                    className={`doc-item${sel.doctor?._id === d._id ? " selected" : ""}`}
                    onClick={() => setSel((s) => ({ ...s, doctor: d }))}
                  >
                    <div
                      className="doc-av"
                      style={{ background: `hsl(${Math.random() * 360}, 70%, 60%)` }}
                    >
                      {d.name.split(" ")[0][0]}{d.name.split(" ")[1]?.[0] || ""}
                    </div>
                    <div className="doc-info">
                      <h4>{d.name}</h4>
                      <p>{d.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="nav-btns">
              <button className="btn-back" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button className="btn-next" disabled={!sel.doctor} onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Slot */}
        {step === 2 && (
          <div className="card">
            <div className="card-title">Pick Date & Time</div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Preferred Date</label>
              <input
                className="form-input"
                type="date"
                min={minDate}
                value={sel.date}
                onChange={(e) => setSel((s) => ({ ...s, date: e.target.value }))}
              />
            </div>
            <label className="form-label">Available Slots</label>
            <div className="slots-grid" style={{ marginTop: 8 }}>
              {SLOTS.map((slot) => (
                <div
                  key={slot}
                  className={`slot${sel.slot === slot ? " selected" : ""}`}
                  onClick={() => setSel((s) => ({ ...s, slot }))}
                >
                  {slot}
                </div>
              ))}
            </div>
            <div className="nav-btns">
              <button className="btn-back" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn-next" disabled={!sel.date || !sel.slot} onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="card">
            <div className="card-title">Appointment Summary</div>
            <div
              style={{
                background: "rgba(15,157,116,0.05)",
                border: "1px solid rgba(15,157,116,0.14)",
                borderRadius: 14,
                padding: "16px 18px",
                marginBottom: 22,
                fontSize: 13,
                lineHeight: 2,
                color: "#102033",
              }}
            >
              <b>Department:</b> {sel.dept}
              <br />
              <b>Doctor:</b> {sel.doctor?.name}
              <br />
              <b>Date:</b> {sel.date} at {sel.slot}
              <br />
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Visit</label>
              <textarea
                className="form-textarea"
                placeholder="Briefly describe your symptoms or reason…"
                value={sel.reason}
                onChange={(e) => setSel((s) => ({ ...s, reason: e.target.value }))}
              />
            </div>
            <div className="nav-btns">
              <button className="btn-back" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="btn-next" onClick={confirm} disabled={loading || !sel.reason}>
                {loading ? "Confirming…" : "✅ Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="card">
            <div className="success-state">
              <div className="tick">🎉</div>
              <h2>Appointment Booked!</h2>
              <p>
                Your appointment with <b>{sel.doctor?.name}</b> ({sel.dept})
                <br />
                has been confirmed for <b>{sel.date}</b> at <b>{sel.slot}</b>.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn-next"
                  onClick={() => navigate("/appointments")}
                  style={{ marginTop: 0 }}
                >
                  View Appointments
                </button>
                <button
                  className="btn-back"
                  onClick={() => {
                    setSel({ dept: "", doctor: null, slot: "", date: "", reason: "" });
                    setStep(0);
                    setError("");
                  }}
                >
                  Book Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}