import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%); min-height: 100vh; }
  .page { min-height: 100vh; padding-top: 70px; }
  .content { max-width: 960px; margin: 0 auto; padding: 36px 24px 60px; }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 14px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: #102033; }

  .cat-tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
  .cat-tab { padding: 8px 18px; border-radius: 20px; border: 1.5px solid rgba(15,23,42,0.10); background: transparent; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:#5f6f87; cursor:pointer; transition:all 0.18s; }
  .cat-tab.active { background: rgba(15,157,116,0.10); border-color: rgba(15,157,116,0.28); color: #0f9d74; font-weight:700; }

  .record-card {
    display: flex; align-items: center; gap: 16px;
    background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.07);
    border-radius: 16px; padding: 18px 22px; margin-bottom: 12px;
    box-shadow: 0 3px 12px rgba(15,23,42,0.05);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-wrap: wrap;
  }
  .record-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(15,23,42,0.09); }
  .rec-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .rec-main { flex: 1; min-width: 160px; }
  .rec-main h3 { font-size: 15px; font-weight: 700; color: #102033; margin-bottom: 3px; }
  .rec-main p { font-size: 12px; color: #5f6f87; }
  .rec-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .rec-actions { display: flex; gap: 8px; }
  .btn-icon { padding: 8px 14px; border-radius: 9px; border: 1.5px solid rgba(15,23,42,0.10); background: transparent; font-size:12px; font-weight:600; cursor:pointer; color:#5f6f87; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .btn-icon:hover { background: rgba(15,157,116,0.08); border-color: rgba(15,157,116,0.22); color: #0f9d74; }
`;
function injectCSS(id, css) { if (document.getElementById(id)) return; const s = document.createElement("style"); s.id = id; s.textContent = css; document.head.appendChild(s); }

const RECORDS = [
  { id:1, name:"Blood Test Report",       type:"Lab Report",    date:"20 Apr 2025", doctor:"Dr. Meena Joshi",  icon:"🩸", bg:"rgba(239,68,68,0.10)",    cat:"lab"          },
  { id:2, name:"ECG Report",              type:"Cardiac",       date:"15 Apr 2025", doctor:"Dr. Priya Reddy",  icon:"🫀", bg:"rgba(15,157,116,0.10)",   cat:"cardiac"      },
  { id:3, name:"Prescription — Cardio",   type:"Prescription",  date:"10 Apr 2025", doctor:"Dr. Priya Reddy",  icon:"💊", bg:"rgba(139,92,246,0.10)",   cat:"prescription" },
  { id:4, name:"Urine Analysis",          type:"Lab Report",    date:"5 Apr 2025",  doctor:"Dr. Meena Joshi",  icon:"🔬", bg:"rgba(47,143,182,0.10)",   cat:"lab"          },
  { id:5, name:"X-Ray — Right Knee",      type:"Radiology",     date:"1 Apr 2025",  doctor:"Dr. Sneha Sharma", icon:"🦴", bg:"rgba(245,158,11,0.10)",   cat:"radiology"    },
  { id:6, name:"Prescription — Neuro",    type:"Prescription",  date:"28 Mar 2025", doctor:"Dr. Arjun Mehta",  icon:"💊", bg:"rgba(139,92,246,0.10)",   cat:"prescription" },
  { id:7, name:"Ophthalmology Report",    type:"Eye Care",      date:"20 Mar 2025", doctor:"Dr. Suresh Iyer",  icon:"👁️", bg:"rgba(8,145,178,0.10)",    cat:"other"        },
];

const CATS = ["all","lab","prescription","radiology","cardiac","other"];

export default function Records() {
  injectCSS("rec-css", CSS);
  const navigate = useNavigate();
  const [cat, setCat] = useState("all");

  useEffect(() => { if (!localStorage.getItem("user")) navigate("/login"); }, [navigate]);

  const filtered = cat === "all" ? RECORDS : RECORDS.filter(r => r.cat === cat);

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <h1 className="page-title">🗂️ Health Records</h1>
          <button style={{ padding:"10px 22px", borderRadius:11, background:"linear-gradient(135deg,#0f9d74,#2f8fb6)", color:"#fff", border:"none", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(15,157,116,0.22)" }}>
            + Upload Record
          </button>
        </div>

        <div className="cat-tabs">
          {CATS.map(c => (
            <button key={c} className={`cat-tab${cat===c?" active":""}`} onClick={() => setCat(c)}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>

        {filtered.map(r => (
          <div className="record-card" key={r.id}>
            <div className="rec-icon" style={{ background: r.bg }}>{r.icon}</div>
            <div className="rec-main">
              <h3>{r.name}</h3>
              <p>{r.type} · {r.date} · {r.doctor}</p>
            </div>
            <span className="rec-badge" style={{ background: r.bg, color:"#102033" }}>{r.type}</span>
            <div className="rec-actions">
              <button className="btn-icon">👁 View</button>
              <button className="btn-icon">⬇ Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}