import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const NAV_CSS = `
  .nav-root {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(15,23,42,0.07);
    box-shadow: 0 2px 20px rgba(15,23,42,0.05);
    font-family: 'DM Sans', sans-serif;
  }
  .nav-brand {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #102033;
    text-decoration: none;
  }
  .nav-brand span { color: #0f9d74; }
  .nav-links {
    display: flex; align-items: center; gap: 4px;
    list-style: none;
  }
  .nav-links a {
    padding: 8px 14px; border-radius: 10px;
    font-size: 14px; font-weight: 500; color: #5f6f87;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
  }
  .nav-links a:hover, .nav-links a.active {
    background: rgba(15,157,116,0.08);
    color: #0f9d74;
  }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .nav-btn-login {
    padding: 9px 20px; border-radius: 10px;
    border: 1.5px solid rgba(15,23,42,0.10);
    background: transparent; color: #102033;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
  }
  .nav-btn-login:hover { background: rgba(15,157,116,0.06); border-color: rgba(15,157,116,0.25); color: #0f9d74; }
  .nav-btn-signup {
    padding: 9px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(15,157,116,0.22);
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .nav-btn-signup:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(15,157,116,0.30); }

  /* profile button */
  .nav-profile-btn {
    display: flex; align-items: center; gap: 9px;
    padding: 6px 12px 6px 6px; border-radius: 40px;
    border: 1.5px solid rgba(15,157,116,0.18);
    background: rgba(255,255,255,0.90); cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .nav-profile-btn:hover { border-color: rgba(15,157,116,0.40); background: rgba(255,255,255,1); box-shadow: 0 4px 14px rgba(15,157,116,0.12); }
  .nav-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    flex-shrink: 0;
  }
  .nav-profile-name { font-size: 13px; font-weight: 600; color: #102033; max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nav-chevron { font-size: 10px; color: #5f6f87; transition: transform 0.2s; }
  .nav-chevron.open { transform: rotate(180deg); }

  /* dropdown */
  .nav-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    min-width: 200px;
    background: rgba(255,255,255,0.98);
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(15,23,42,0.12);
    padding: 8px;
    animation: dropIn 0.18s ease;
    z-index: 200;
  }
  @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .nav-dropdown-header {
    padding: 10px 12px 12px;
    border-bottom: 1px solid rgba(15,23,42,0.06);
    margin-bottom: 6px;
  }
  .nav-dropdown-header p { font-size: 13px; font-weight: 700; color: #102033; }
  .nav-dropdown-header span { font-size: 11px; color: #5f6f87; }
  .nav-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: #102033;
    text-decoration: none; cursor: pointer; border: none;
    background: none; width: 100%; text-align: left;
    transition: background 0.15s, color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-dd-item:hover { background: rgba(15,157,116,0.07); color: #0f9d74; }
  .nav-dd-item.danger:hover { background: rgba(239,68,68,0.07); color: #dc2626; }
  .nav-dd-divider { height: 1px; background: rgba(15,23,42,0.06); margin: 6px 0; }

  /* mobile hamburger */
  .nav-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; padding: 6px; border: none; background: none;
  }
  .nav-hamburger span {
    display: block; width: 22px; height: 2px;
    background: #102033; border-radius: 2px;
    transition: all 0.2s;
  }
  .nav-mobile-menu {
    display: none; position: fixed; top: 70px; left: 0; right: 0;
    background: rgba(255,255,255,0.98);
    border-bottom: 1px solid rgba(15,23,42,0.07);
    padding: 16px 24px 20px;
    flex-direction: column; gap: 4px;
    z-index: 99;
    box-shadow: 0 8px 24px rgba(15,23,42,0.08);
    animation: dropIn 0.18s ease;
  }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-menu a, .nav-mobile-menu button {
    padding: 11px 14px; border-radius: 10px;
    font-size: 14px; font-weight: 500; color: #102033;
    text-decoration: none; border: none; background: none;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    text-align: left; width: 100%;
    transition: background 0.15s;
  }
  .nav-mobile-menu a:hover { background: rgba(15,157,116,0.07); color: #0f9d74; }
  .nav-mobile-menu .mob-logout { color: #dc2626; }
  .nav-mobile-menu .mob-logout:hover { background: rgba(239,68,68,0.07); }

  @media (max-width: 768px) {
    .nav-root { padding: 0 20px; }
    .nav-links { display: none; }
    .nav-actions { display: none; }
    .nav-hamburger { display: flex; }
  }
`;

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

export default function Navbar() {
  const [user, setUser] = useState(getUser);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // re-read user on route change (handles login redirect back)
  useEffect(() => { setUser(getUser()); }, [location.pathname]);

  // close dropdown on outside click
  useEffect(() => {
    function handler(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // inject styles once
  useEffect(() => {
    if (document.getElementById("nav-styles")) return;
    const s = document.createElement("style");
    s.id = "nav-styles"; s.textContent = NAV_CSS;
    document.head.appendChild(s);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); setOpen(false); setMobileOpen(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isActive = (path) => location.pathname === path ? "active" : "";

  const patientLinks = [
    { to: "/dashboard",         label: "Dashboard",    icon: "🏠" },
    { to: "/appointments",      label: "Appointments", icon: "📅" },
    { to: "/records",           label: "Records",      icon: "🗂️" },
  ];
  const doctorLinks = [
    { to: "/doctor/dashboard",  label: "Dashboard",    icon: "🏠" },
    { to: "/doctor/patients",   label: "Patients",     icon: "👥" },
  ];
  const adminLinks = [
    { to: "/admin",             label: "Admin Panel",  icon: "⚙️" },
  ];

  const navLinks = user?.role === "doctor" ? doctorLinks
    : user?.role === "admin" ? adminLinks
    : user ? patientLinks : [];

  return (
    <>
      <nav className="nav-root">
        {/* Brand */}
        <Link to="/" className="nav-brand">🏥 <span>Medi</span>Care Plus</Link>

        {/* Desktop links */}
        {user && (
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={isActive(l.to)}>{l.icon} {l.label}</Link>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ position: "relative" }} ref={dropRef}>
              <button className="nav-profile-btn" onClick={() => setOpen(o => !o)}>
                <div className="nav-avatar">{initials}</div>
                <span className="nav-profile-name">{user.name}</span>
                <span className={`nav-chevron${open ? " open" : ""}`}>▼</span>
              </button>
              {open && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p>{user.name}</p>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/profile"      className="nav-dd-item" onClick={() => setOpen(false)}>👤 My Profile</Link>
                  <Link to="/appointments" className="nav-dd-item" onClick={() => setOpen(false)}>📅 Appointments</Link>
                  <Link to="/records"      className="nav-dd-item" onClick={() => setOpen(false)}>🗂️ Health Records</Link>
                  <div className="nav-dd-divider" />
                  <button className="nav-dd-item danger" onClick={logout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"  className="nav-btn-login">Login</Link>
              <Link to="/signup" className="nav-btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${mobileOpen ? " open" : ""}`}>
        {user ? (
          <>
            <div style={{ padding: "8px 14px 12px", borderBottom: "1px solid rgba(15,23,42,0.06)", marginBottom: 6 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#102033" }}>{user.name}</p>
              <p style={{ fontSize: 12, color: "#5f6f87" }}>{user.email}</p>
            </div>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>{l.icon} {l.label}</Link>
            ))}
            <Link to="/profile" onClick={() => setMobileOpen(false)}>👤 My Profile</Link>
            <button className="mob-logout" onClick={logout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"  onClick={() => setMobileOpen(false)}>🔑 Login</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>✨ Sign Up</Link>
          </>
        )}
      </div>
    </>
  );
}