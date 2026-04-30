import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

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

const ALL_APPTS = [
  { id:1, doctor:"Dr. Priya Reddy",  dept:"Cardiology",  date:"27 Apr 2025", time:"3:00 PM",  type:"In-Person", status:"confirmed", color:"#059669", init:"PR" },
  { id:2, doctor:"Dr. Arjun Mehta",  dept:"Neurology",   date:"28 Apr 2025", time:"10:30 AM", type:"Online",    status:"pending",   color:"#0d9488", init:"AM" },
  { id:3, doctor:"Dr. Sneha Sharma", dept:"Orthopedics", date:"2 May 2025",  time:"9:00 AM",  type:"In-Person", status:"confirmed", color:"#7c3aed", init:"SS" },
  { id:4, doctor:"Dr. Kiran Rao",    dept:"Dental",      date:"10 Apr 2025", time:"11:00 AM", type:"In-Person", status:"completed", color:"#2563eb", init:"KR" },
  { id:5, doctor:"Dr. Meena Joshi",  dept:"Pathology",   date:"5 Apr 2025",  time:"8:30 AM",  type:"Lab Visit", status:"completed", color:"#db2777", init:"MJ" },
  { id:6, doctor:"Dr. Vikram Nair",  dept:"General",     date:"1 Apr 2025",  time:"4:00 PM",  type:"Online",    status:"cancelled", color:"#64748b", init:"VN" },
];

export default function Appointments() {
  injectCSS("appt-css", CSS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? ALL_APPTS : ALL_APPTS.filter(a => a.status === filter);

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

        <div className="filter-tabs">
          {["all","confirmed","pending","completed","cancelled"].map(f => (
            <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)} {f==="all" ? `(${ALL_APPTS.length})` : `(${ALL_APPTS.filter(a=>a.status===f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div>📭</div><h3>No {filter} appointments</h3><p>Book an appointment to get started.</p></div>
        ) : filtered.map(a => (
          <div className="appt-card" key={a.id}>
            <div className="doc-avatar" style={{ background: a.color }}>{a.init}</div>
            <div className="appt-main">
              <h3>{a.doctor}</h3>
              <p>{a.dept}</p>
            </div>
            <div className="appt-meta">
              <span className="meta-chip">📅 {a.date}</span>
              <span className="meta-chip">🕐 {a.time}</span>
              <span className="meta-chip">📍 {a.type}</span>
            </div>
            <span className={`badge badge-${a.status}`}>{a.status}</span>
            {(a.status === "confirmed" || a.status === "pending") && (
              <div className="appt-actions">
                <button className="btn-sm btn-sm-primary">Reschedule</button>
                <button className="btn-sm btn-sm-ghost">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}