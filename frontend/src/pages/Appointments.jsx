import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { appointmentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .page { min-height: 100vh; padding-top: 70px; }
  .content { max-width: 960px; margin: 0 auto; padding: 36px 24px 60px; }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 14px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: #102033; }

  .filter-tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
  .filter-tab {
    padding: 8px 18px; border-radius: 20px; border: 1.5px solid rgba(15,23,42,0.10);
    background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: #5f6f87; cursor: pointer;
    transition: all 0.18s;
  }
  .filter-tab.active { background: rgba(15,157,116,0.10); border-color: rgba(15,157,116,0.28); color: #0f9d74; font-weight: 700; }

  .appt-card {
    background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.07);
    border-radius: 18px; padding: 22px 24px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
    box-shadow: 0 3px 14px rgba(15,23,42,0.05);
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .appt-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.09); }
  .doc-avatar { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .appt-main { flex: 1; min-width: 180px; }
  .appt-main h3 { font-size: 15px; font-weight: 700; color: #102033; margin-bottom: 4px; }
  .appt-main p { font-size: 13px; color: #5f6f87; margin-bottom: 2px; }
  .appt-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .meta-chip { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #5f6f87; background: rgba(15,23,42,0.04); padding: 5px 10px; border-radius: 8px; }
  .badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .badge-confirmed { background: rgba(15,157,116,0.10); color: #0b7d5d; }
  .badge-pending   { background: rgba(245,158,11,0.10); color: #b45309; }
  .badge-completed { background: rgba(100,116,139,0.10); color: #475569; }
  .badge-cancelled { background: rgba(239,68,68,0.10); color: #dc2626; }
  .appt-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn-sm {
    padding: 8px 16px; border-radius: 9px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid rgba(15,23,42,0.10); font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .btn-sm-primary { background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; border-color: transparent; box-shadow: 0 3px 10px rgba(15,157,116,0.20); }
  .btn-sm-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(15,157,116,0.28); }
  .btn-sm-ghost { background: transparent; color: #5f6f87; }
  .btn-sm-ghost:hover { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.20); color: #dc2626; }

  .empty-state { text-align: center; padding: 60px 24px; color: #5f6f87; }
  .empty-state div { font-size: 48px; margin-bottom: 14px; }
  .empty-state h3 { font-size: 18px; font-weight: 700; color: #102033; margin-bottom: 8px; }
`;
function injectCSS(id, css) { if (document.getElementById(id)) return; const s = document.createElement("style"); s.id = id; s.textContent = css; document.head.appendChild(s); }

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function initialsFromName(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "A";
}

function colorFromName(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return `hsl(${hash}, 65%, 50%)`;
}

export default function Appointments() {
  injectCSS("appt-css", CSS);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true, state: { returnTo: "/appointments" } });
      return;
    }

    const fetchAppointments = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await appointmentAPI.getAppointments();
        if (response.success) {
          setAppointments(response.appointments || []);
        } else {
          setError(response.message || "Failed to load appointments");
        }
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authLoading, isAuthenticated, navigate]);

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((appointment) => appointment.status === filter);

  const totalCount = appointments.length;

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <h1 className="page-title">📅 My Appointments</h1>
          <Link to="/appointments/book" style={{ padding:"10px 22px", borderRadius:11, background:"linear-gradient(135deg,#0f9d74,#2f8fb6)", color:"#fff", textDecoration:"none", fontSize:14, fontWeight:700, boxShadow:"0 4px 14px rgba(15,157,116,0.22)" }}>
            + Book New
          </Link>
        </div>

        {error && <div className="alert-error">⚠️ {error}</div>}

        {loading ? (
          <div className="empty-state">
            <div>⏳</div>
            <h3>Loading appointments</h3>
            <p>Fetching your bookings from the database.</p>
          </div>
        ) : (
          <>
            <div className="filter-tabs">
              {[
                "all",
                "pending",
                "confirmed",
                "completed",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  className={`filter-tab${filter===status?" active":""}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase()+status.slice(1)} {status==="all" ? `(${totalCount})` : `(${appointments.filter((appointment) => appointment.status === status).length})`}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div>📭</div>
                <h3>No {filter} appointments</h3>
                <p>Book an appointment to get started.</p>
              </div>
            ) : filtered.map((appointment) => {
              const doctorName = appointment.doctorId?.name || "Unknown Doctor";
              const specialization = appointment.doctorId?.specialization || "Specialist";
              const avatarColor = colorFromName(doctorName);
              return (
                <div className="appt-card" key={appointment._id}>
                  <div className="doc-avatar" style={{ background: avatarColor }}>
                    {initialsFromName(doctorName)}
                  </div>
                  <div className="appt-main">
                    <h3>{doctorName}</h3>
                    <p>{specialization}</p>
                  </div>
                  <div className="appt-meta">
                    <span className="meta-chip">📅 {formatDate(appointment.appointmentDate)}</span>
                    <span className="meta-chip">🕐 {appointment.appointmentTime}</span>
                  </div>
                  <span className={`badge badge-${appointment.status}`}>{appointment.status}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}