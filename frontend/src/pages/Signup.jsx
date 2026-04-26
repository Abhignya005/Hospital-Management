import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }

  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(15,157,116,0.10) 0%, transparent 60%),
                radial-gradient(ellipse 60% 70% at 80% 80%, rgba(47,143,182,0.08) 0%, transparent 60%),
                #f8fbff;
  }
  .auth-card {
    background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.08);
    border-radius: 28px; padding: 44px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 64px rgba(15,23,42,0.10);
    backdrop-filter: blur(12px);
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  .auth-logo { text-align: center; margin-bottom: 24px; }
  .auth-logo a { font-family: 'DM Serif Display', serif; font-size: 22px; color: #102033; text-decoration: none; }
  .auth-logo span { color: #0f9d74; }
  .auth-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #102033; margin-bottom: 6px; text-align: center; }
  .auth-sub { font-size: 14px; color: #5f6f87; text-align: center; margin-bottom: 28px; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #102033; margin-bottom: 7px; }
  .form-input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.90);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #102033;
    outline: none; transition: border-color 0.18s, box-shadow 0.18s;
  }
  .form-input:focus { border-color: #0f9d74; box-shadow: 0 0 0 3px rgba(15,157,116,0.10); }
  .form-input::placeholder { color: #a0aec0; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .form-select {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.90);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #102033;
    outline: none; cursor: pointer;
    transition: border-color 0.18s;
  }
  .form-select:focus { border-color: #0f9d74; }

  .btn-submit {
    width: 100%; padding: 14px; border-radius: 13px; border: none;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    box-shadow: 0 8px 24px rgba(15,157,116,0.24);
    transition: transform 0.18s, box-shadow 0.18s;
    margin-top: 8px;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(15,157,116,0.30); }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .password-strength { margin-top: 6px; height: 4px; border-radius: 4px; background: #e7edf7; overflow: hidden; }
  .password-strength-bar { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }

  .terms-check { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #5f6f87; margin: 16px 0 4px; cursor: pointer; }
  .terms-check input { margin-top: 2px; accent-color: #0f9d74; flex-shrink: 0; }
  .terms-check a { color: #0f9d74; font-weight: 500; }

  .alert-error { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #b42318; margin-bottom: 16px; }
  .alert-success { background: rgba(15,157,116,0.07); border: 1px solid rgba(15,157,116,0.20); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #0b7d5d; margin-bottom: 16px; }

  .auth-footer { text-align: center; font-size: 13px; color: #5f6f87; margin-top: 20px; }
  .auth-footer a { color: #0f9d74; font-weight: 600; text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }

  @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } .auth-card { padding: 30px 22px; } }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style"); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

function passwordStrength(p) {
  if (!p) return { score: 0, label: "", color: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  return { score, label: map[score], color: colors[score] };
}

export default function Signup() {
  injectCSS("signup-css", CSS);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", dob:"", gender:"", password:"", confirm:"", role:"patient", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = passwordStrength(form.password);

  const handle = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.terms) { setError("Please accept the terms and conditions."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API

    // ── Replace with real API call ──
    const user = { name: `${form.firstName} ${form.lastName}`, email: form.email, role: form.role };
    localStorage.setItem("user",  JSON.stringify(user));
    localStorage.setItem("token", "demo-token-" + Date.now());
    // ── End replace ──

    navigate(form.role === "doctor" ? "/doctor/dashboard" : "/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Link to="/">🏥 <span>Medi</span>Care Plus</Link></div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of patients managing their health smarter</p>

        {error && <div className="alert-error">⚠️ {error}</div>}

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" name="firstName" placeholder="Ravi" value={form.firstName} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" name="lastName" placeholder="Kumar" value={form.lastName} onChange={handle} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" name="phone" placeholder="+91 9000000000" value={form.phone} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" name="dob" value={form.dob} onChange={handle} />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={form.gender} onChange={handle}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role} onChange={handle}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} required />
            {form.password && (
              <>
                <div className="password-strength">
                  <div className="password-strength-bar" style={{ width: `${strength.score * 25}%`, background: strength.color }} />
                </div>
                <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 600 }}>{strength.label}</p>
              </>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handle} required />
          </div>
          <label className="terms-check">
            <input type="checkbox" name="terms" checked={form.terms} onChange={handle} />
            I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </label>
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}