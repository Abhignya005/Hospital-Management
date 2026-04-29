import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { appointmentAPI } from "../services/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .dash-page { min-height: 100vh; padding-top: 70px; }
  .dash-content { max-width: 1100px; margin: 0 auto; padding: 36px 24px 60px; }
  .dash-header { margin-bottom: 32px; }
  .dash-greeting { font-family: 'DM Serif Display', serif; font-size: clamp(24px,4vw,36px); color: #102033; margin-bottom: 6px; }
  .dash-date { font-size: 14px; color: #5f6f87; }

  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: rgba(255,255,255,0.92); border: 1px solid rgba(15,23,42,0.07);
    border-radius: 18px; padding: 22px 24px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 4px 18px rgba(15,23,42,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(15,23,42,0.09); }
  .stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .stat-info p { font-size: 13px; color: #5f6f87; margin-bottom: 3px; }
  .stat-info h3 { font-size: 22px; font-weight: 700; color: #102033; }

  .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .dash-section { background: rgba(255,255,255,0.92); border: 1px solid rgba(15,23,42,0.07); border-radius: 20px; padding: 24px; box-shadow: 0 4px 18px rgba(15,23,42,0.05); }
  .section-title { font-size: 16px; font-weight: 700; color: #102033; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; justify-content: space-between; }
  .section-title a { font-size: 12px; font-weight: 500; color: #0f9d74; text-decoration: none; }
  .section-title a:hover { text-decoration: underline; }

  .appt-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(15,23,42,0.05); }
  .appt-item:last-child { border-bottom: none; padding-bottom: 0; }
  .appt-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .appt-info { flex: 1; }
  .appt-info p { font-size: 14px; font-weight: 600; color: #102033; }
  .appt-info span { font-size: 12px; color: #5f6f87; }
  .appt-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-confirmed { background: rgba(15,157,116,0.10); color: #0b7d5d; }
  .badge-pending   { background: rgba(245,158,11,0.10); color: #b45309; }
  .badge-completed { background: rgba(100,116,139,0.10); color: #475569; }

  .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .quick-btn {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 18px 12px; border-radius: 14px;
    border: 1.5px solid rgba(15,23,42,0.08);
    background: rgba(255,255,255,0.80); cursor: pointer;
    text-decoration: none; color: #102033;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .quick-btn:hover { background: rgba(15,157,116,0.07); border-color: rgba(15,157,116,0.22); transform: translateY(-2px); }
  .quick-btn-icon { font-size: 24px; }
  .quick-btn-label { font-size: 12px; font-weight: 600; color: #102033; text-align: center; }

  .health-metric { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid rgba(15,23,42,0.05); }
  .health-metric:last-child { border-bottom: none; }
  .metric-left { display: flex; align-items: center; gap: 10px; }
  .metric-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .metric-name { font-size: 13px; color: #5f6f87; }
  .metric-value { font-size: 14px; font-weight: 700; color: #102033; }
  .metric-status { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 10px; }
  .status-normal  { background: rgba(15,157,116,0.10); color: #0b7d5d; }
  .status-high    { background: rgba(239,68,68,0.10); color: #dc2626; }
  .status-low     { background: rgba(245,158,11,0.10); color: #b45309; }

  @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } .quick-actions { grid-template-columns: repeat(4,1fr); } }
  @media (max-width: 480px) { .quick-actions { grid-template-columns: 1fr 1fr; } }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style"); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const QUICK = [
  { icon: "📅", label: "Book Appointment", to: "/appointments/book" },
  { icon: "🗂️", label: "Health Records",   to: "/records" },
  { icon: "💊", label: "Prescriptions",    to: "/records" },
  { icon: "👤", label: "My Profile",       to: "/profile" },
];

export default function Dashboard() {
  injectCSS("dash-css", CSS);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) { navigate("/login"); return; }
    setUser(u);
    
    // Redirect doctors to their appointments page
    if (u.role === "doctor") {
      navigate("/doctor/appointments");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadAppointments = async () => {
      const response = await appointmentAPI.getAppointments();
      if (response.success) {
        setAppointments(response.appointments || []);
      }
      setAppointmentsLoading(false);
    };

    if (user) {
      loadAppointments().catch(() => setAppointmentsLoading(false));
    }
  }, [user]);

  const now = new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const firstName = user?.name?.split(" ")[0] || "there";
  const upcomingAppointments = appointments.filter((appointment) => appointment.status !== "cancelled");

  if (!user) return null;

  return (
    <div className="dash-page">
      <Navbar />
      <div className="dash-content">
        <div className="dash-header">
          <h1 className="dash-greeting">Good morning, {firstName} 👋</h1>
          <p className="dash-date">{now}</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { icon:"📅", bg:"rgba(15,157,116,0.10)",  label:"Total Appointments", value: appointmentsLoading ? "…" : String(appointments.length) },
            { icon:"✅", bg:"rgba(47,143,182,0.10)",   label:"Completed",          value: appointmentsLoading ? "…" : String(appointments.filter((appointment) => appointment.status === "completed").length) },
            { icon:"⏳", bg:"rgba(245,158,11,0.10)",   label:"Upcoming",           value: appointmentsLoading ? "…" : String(upcomingAppointments.filter((appointment) => appointment.status === "pending" || appointment.status === "confirmed").length) },
            { icon:"📋", bg:"rgba(139,92,246,0.10)",   label:"Health Records",     value:"0" },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-info"><p>{s.label}</p><h3>{s.value}</h3></div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* Upcoming appointments */}
          <div className="dash-section">
            <div className="section-title">
              <span>📅 Upcoming Appointments</span>
              <Link to="/appointments">View all →</Link>
            </div>
            {appointmentsLoading ? (
              <div className="appt-item">
                <div className="appt-info">
                  <p>Loading appointments...</p>
                  <span>Fetching your saved bookings</span>
                </div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="appt-item">
                <div className="appt-info">
                  <p>No appointments yet</p>
                  <span>Book your first appointment to see it here.</span>
                </div>
              </div>
            ) : upcomingAppointments.slice(0, 3).map((appointment) => (
              <div className="appt-item" key={appointment._id}>
                <div className="appt-avatar" style={{ background: "linear-gradient(135deg,#0f9d74,#2f8fb6)" }}>
                  {(appointment.doctorId?.name || "D").split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="appt-info">
                  <p>{appointment.doctorId?.name || "Unknown Doctor"}</p>
                  <span>{appointment.doctorId?.specialization || "Specialist"} · {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <span className={`appt-badge badge-${appointment.status}`}>{appointment.status}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="dash-section">
            <div className="section-title"><span>⚡ Quick Actions</span></div>
            <div className="quick-actions">
              {QUICK.map(q => (
                <Link to={q.to} className="quick-btn" key={q.label}>
                  <span className="quick-btn-icon">{q.icon}</span>
                  <span className="quick-btn-label">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Health metrics */}
          <div className="dash-section">
            <div className="section-title">
              <span>❤️ Health Metrics</span>
              <Link to="/records">Update →</Link>
            </div>
            <div className="appt-item" style={{ borderBottom: "none" }}>
              <div className="appt-info">
                <p>No health metrics connected yet</p>
                <span>Real vitals will appear here once the records module is integrated.</span>
              </div>
            </div>
          </div>

          {/* Recent records */}
          <div className="dash-section">
            <div className="section-title">
              <span>🗂️ Recent Records</span>
              <Link to="/records">View all →</Link>
            </div>
            <div className="appt-item" style={{ borderBottom: "none" }}>
              <div className="appt-info">
                <p>No records uploaded yet</p>
                <span>Upload real reports here once records support is connected.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}