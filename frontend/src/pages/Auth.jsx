import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

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

  .tab-switcher {
    display: flex; gap: 8px; margin-bottom: 32px; background: rgba(15,23,42,0.04);
    border-radius: 12px; padding: 4px;
  }
  .tab-btn {
    flex: 1; padding: 11px 16px; border-radius: 10px; border: none;
    background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; color: #5f6f87; cursor: pointer;
    transition: all 0.18s;
  }
  .tab-btn.active {
    background: #fff; color: #0f9d74; box-shadow: 0 2px 8px rgba(15,157,116,0.15);
  }

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

  .form-select {
    width: 100%; padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.12);
    background: rgba(255,255,255,0.90);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #102033;
    outline: none; cursor: pointer; transition: border-color 0.18s;
  }
  .form-select:focus { border-color: #0f9d74; }

  .form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .form-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5f6f87; cursor: pointer; }
  .form-check input { accent-color: #0f9d74; }

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

  .password-strength { margin-top: 6px; height: 4px; border-radius: 4px; background: #e7edf7; overflow: hidden; }
  .password-strength-bar { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }

  .terms-check { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #5f6f87; margin: 16px 0; cursor: pointer; }
  .terms-check input { margin-top: 2px; accent-color: #0f9d74; flex-shrink: 0; }
  .terms-check a { color: #0f9d74; font-weight: 500; }

  .alert-error {
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20);
    border-radius: 10px; padding: 11px 14px;
    font-size: 13px; color: #b42318; margin-bottom: 18px;
  }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .role-radios { display: flex; gap: 24px; margin-top: 8px; }
  .role-radios label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: #102033; font-weight: 500; }
  .role-radios input { accent-color: #0f9d74; cursor: pointer; }

  @media (max-width: 480px) { .auth-card { padding: 30px 22px; } .form-grid { grid-template-columns: 1fr; } }
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

export default function Auth() {
  injectCSS("auth-css", CSS);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth, isAuthenticated, loading } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(location.state?.returnTo || "/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Determine initial mode from URL
  const initialMode = location.pathname.includes("/signup") ? "signup" : "login";
  const [mode, setMode] = useState(initialMode); // "login" or "signup"
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Signup form
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    gender: "",
    role: "patient",
    terms: false,
  });

  const strength = passwordStrength(signupForm.password);

  const handleLoginChange = (e) => {
    setLoginForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSignupChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSignupForm((f) => ({ ...f, [e.target.name]: val }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authAPI.login(loginForm.email, loginForm.password);

      if (response.success) {
        setAuth(response.user, response.token);
        navigate(location.state?.returnTo || "/dashboard", { replace: true });
      } else {
        // If backend reports user not found, prompt signup
        const msg = response.message || "Login failed. Please check your credentials.";
        if (response.status === 404 || /not found/i.test(msg) || /no user/i.test(msg)) {
          setSignupForm((s) => ({ ...s, email: loginForm.email }));
          setMode('signup');
          setError('No account found for this email — please create one below.');
        } else {
          setError(msg);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (signupForm.password !== signupForm.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!signupForm.terms) {
      setError("Please accept the terms and conditions.");
      return;
    }
    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authAPI.signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        gender: signupForm.gender || undefined,
        role: signupForm.role,
      });

      if (response.success) {
        setAuth(response.user, response.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {isAuthenticated && !loading ? (
          <div style={{ textAlign: 'center', color: '#0f9d74', fontSize: '18px', padding: '40px 0' }}>
            Already logged in. Redirecting to dashboard...
          </div>
        ) : (
          <>
            <div className="auth-logo">
              <Link to="/">🏥 <span>Medi</span>Care Plus</Link>
            </div>

            {/* Tab Switcher */}
            <div className="tab-switcher">
              <button
                className={`tab-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >
                Sign In
              </button>
              <button
                className={`tab-btn ${mode === "signup" ? "active" : ""}`}
                onClick={() => { setMode("signup"); setError(""); }}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            {mode === "login" && (
              <>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-sub">Sign in to your account to continue</p>

                {error && <div className="alert-error">⚠️ {error}</div>}

                <form onSubmit={submitLogin}>
                  <div className="form-group">
                    <label className="form-label">Email address</label>
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label className="form-check">
                      <input type="checkbox" /> Remember me
                    </label>
                  </div>
                  <button className="btn-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in…" : "Sign In →"}
                  </button>
                </form>
              </>
            )}

            {/* Signup Form */}
            {mode === "signup" && (
              <>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-sub">Join thousands of patients managing their health smarter</p>

                {error && <div className="alert-error">⚠️ {error}</div>}

                <form onSubmit={submitSignup}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      name="name"
                      placeholder="John Doe"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email address</label>
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      placeholder="Min. 6 characters"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      required
                    />
                    {signupForm.password && (
                      <>
                        <div className="password-strength">
                          <div
                            className="password-strength-bar"
                            style={{ width: `${strength.score * 25}%`, background: strength.color }}
                          />
                        </div>
                        <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontWeight: 600 }}>
                          {strength.label}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      className="form-input"
                      type="password"
                      name="confirm"
                      placeholder="Re-enter password"
                      value={signupForm.confirm}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={signupForm.gender}
                      onChange={handleSignupChange}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <div className="role-radios">
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="patient"
                          checked={signupForm.role === "patient"}
                          onChange={handleSignupChange}
                        />
                        Patient
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="doctor"
                          checked={signupForm.role === "doctor"}
                          onChange={handleSignupChange}
                        />
                        Doctor
                      </label>
                    </div>
                  </div>
                  <label className="terms-check">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={signupForm.terms}
                      onChange={handleSignupChange}
                    />
                    I agree to the <a href="/terms">Terms of Service</a> and{" "}
                    <a href="/privacy">Privacy Policy</a>
                  </label>
                  <button className="btn-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account…" : "Create Account →"}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
