import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

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
    border-radius: 28px; padding: 48px 44px;
    width: 100%; max-width: 440px;
    box-shadow: 0 24px 64px rgba(15,23,42,0.10);
    backdrop-filter: blur(12px);
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  .auth-logo { text-align: center; margin-bottom: 28px; }
  .auth-logo a { font-family: 'DM Serif Display', serif; font-size: 22px; color: #102033; text-decoration: none; }
  .auth-logo span { color: #0f9d74; }
  .auth-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #102033; margin-bottom: 6px; text-align: center; }
  .auth-sub { font-size: 14px; color: #5f6f87; text-align: center; margin-bottom: 32px; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #102033; margin-bottom: 7px; }
  .form-input {
    width: 100%; padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.90);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #102033;
    outline: none; transition: border-color 0.18s, box-shadow 0.18s;
  }
  .form-input:focus { border-color: #0f9d74; box-shadow: 0 0 0 3px rgba(15,157,116,0.10); }
  .form-input::placeholder { color: #a0aec0; }

  .form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .form-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5f6f87; cursor: pointer; }
  .form-check input { accent-color: #0f9d74; }
  .form-forgot { font-size: 13px; color: #0f9d74; text-decoration: none; font-weight: 500; }
  .form-forgot:hover { text-decoration: underline; }

  .btn-submit {
    width: 100%; padding: 14px; border-radius: 13px; border: none;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    box-shadow: 0 8px 24px rgba(15,157,116,0.24);
    transition: transform 0.18s, box-shadow 0.18s;
    margin-top: 4px;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(15,157,116,0.30); }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; }
  .auth-divider::before, .auth-divider::after { content:''; flex:1; height:1px; background: rgba(15,23,42,0.08); }
  .auth-divider span { font-size: 12px; color: #a0aec0; }

  .auth-footer { text-align: center; font-size: 13px; color: #5f6f87; margin-top: 22px; }
  .auth-footer a { color: #0f9d74; font-weight: 600; text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }

  .role-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .role-tab {
    flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid rgba(15,23,42,0.10);
    background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: #5f6f87; cursor: pointer;
    transition: all 0.18s;
  }
  .role-tab.active {
    background: rgba(15,157,116,0.08); border-color: rgba(15,157,116,0.30); color: #0f9d74; font-weight: 700;
  }

  .alert-error {
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20);
    border-radius: 10px; padding: 11px 14px;
    font-size: 13px; color: #b42318; margin-bottom: 18px;
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style"); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function Login() {
  injectCSS("login-css", CSS);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(form.email, form.password);
      
      if (response.success) {
        // Token and user are automatically saved in localStorage by authAPI
        navigate(location.state?.returnTo || "/dashboard", { replace: true });
      } else {
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Link to="/">🏥 <span>Medi</span>Care Plus</Link></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && <div className="alert-error">⚠️ {error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handle} required />
          </div>
          <div className="form-row">
            <label className="form-check"><input type="checkbox" /> Remember me</label>
            <a href="#" className="form-forgot">Forgot password?</a>
          </div>
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>



        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}