import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

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

  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(16,32,51,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px;
  }
  .modal-card {
    width: 100%; max-width: 620px; background: #fff; border-radius: 18px;
    border: 1px solid rgba(15,23,42,0.08); box-shadow: 0 20px 60px rgba(15,23,42,0.20);
    padding: 22px;
  }
  .modal-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: #102033; margin-bottom: 16px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-row-full { grid-column: 1 / -1; }
  .form-label { display: block; font-size: 12px; font-weight: 700; color: #3f5064; margin-bottom: 6px; }
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%; padding: 10px 12px; border-radius: 10px;
    border: 1.4px solid rgba(15,23,42,0.12); font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #102033; outline: none;
  }
  .form-textarea { min-height: 84px; resize: vertical; }
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus { border-color: #0f9d74; box-shadow: 0 0 0 3px rgba(15,157,116,0.10); }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
  .btn-secondary,
  .btn-primary {
    border: none; border-radius: 10px; padding: 10px 16px; font-size: 14px;
    font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .btn-secondary { background: #eef2f7; color: #52647a; }
  .btn-primary { background: linear-gradient(135deg,#0f9d74,#2f8fb6); color: #fff; }
  .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  .details-row { margin-bottom: 10px; font-size: 14px; color: #3f5064; }
  .details-row strong { color: #102033; }

  @media (max-width: 700px) {
    .form-grid { grid-template-columns: 1fr; }
  }
`;
function injectCSS(id, css) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return;
  }
  const s = document.createElement("style");
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

const CATS = ["all","lab","prescription","radiology","cardiac","other"];

export default function Records() {
  injectCSS("rec-css", CSS);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [cat, setCat] = useState("all");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    type: "lab",
    title: "",
    description: "",
    doctorName: "",
    visitDate: "",
    results: "",
  });
  const focusRecordId = searchParams.get("recordId");

  const fetchRecords = async (type) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.records.getUserRecords(type);
      if (res && res.success) {
        setRecords(res.records || []);
      } else {
        setRecords([]);
        setError(res?.message || 'Failed to load records');
      }
    } catch (err) {
      setError(err.message || 'Failed to load records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchRecords(cat === 'all' ? 'all' : cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, user, authLoading]);

  useEffect(() => {
    if (!focusRecordId || loading || !records.length) return;
    const target = records.find((r) => r._id === focusRecordId);
    if (target) {
      setSelectedRecord(target);
      const next = new URLSearchParams(searchParams);
      next.delete("recordId");
      setSearchParams(next, { replace: true });
    }
  }, [focusRecordId, loading, records, searchParams, setSearchParams]);

  const getIcon = (type) => {
    switch (type) {
      case 'lab': return '🧪';
      case 'prescription': return '💊';
      case 'radiology': return '🩻';
      case 'cardiac': return '❤️';
      default: return '📄';
    }
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openUploadModal = () => {
    setUploadError("");
    setForm({
      type: cat !== "all" ? cat : "lab",
      title: "",
      description: "",
      doctorName: "",
      visitDate: "",
      results: "",
    });
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    if (!saving) setShowUploadModal(false);
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setUploadError("Title is required");
      return;
    }

    setSaving(true);
    setUploadError("");
    try {
      const payload = {
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        doctorName: form.doctorName.trim(),
        visitDate: form.visitDate || undefined,
        results: form.results.trim(),
      };
      const res = await api.records.createRecord(payload);
      if (res?.success) {
        setShowUploadModal(false);
        await fetchRecords(cat === "all" ? "all" : cat);
      } else {
        setUploadError(res?.message || "Failed to create record");
      }
    } catch (err) {
      setUploadError(err.message || "Failed to create record");
    } finally {
      setSaving(false);
    }
  };

  const downloadRecord = (record) => {
    const lines = [
      `Title: ${record.title || ""}`,
      `Type: ${record.type || ""}`,
      `Doctor: ${record.doctorName || "N/A"}`,
      `Visit Date: ${record.visitDate ? new Date(record.visitDate).toLocaleString() : "N/A"}`,
      `Description: ${record.description || ""}`,
      `Results: ${record.results || ""}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(record.title || "record").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const createDemoRecord = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.records.createRecord({
        type: cat !== "all" ? cat : "lab",
        title: "Demo Health Record",
        description: "This is a sample record to help you get started.",
        doctorName: "Dr. Demo",
        visitDate: new Date().toISOString(),
        results: "Normal",
      });
      if (res?.success) {
        await fetchRecords(cat === "all" ? "all" : cat);
      } else {
        setError(res?.message || "Failed to create demo record");
      }
    } catch (err) {
      setError(err.message || "Failed to create demo record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <h1 className="page-title">🗂️ Health Records</h1>
          <button
            onClick={openUploadModal}
            style={{ padding:"10px 22px", borderRadius:11, background:"linear-gradient(135deg,#0f9d74,#2f8fb6)", color:"#fff", border:"none", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(15,157,116,0.22)" }}>
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

        {loading ? (
          <div className="record-card" style={{ justifyContent: "center", textAlign: "center" }}>
            <div className="rec-main">
              <h3>Loading records…</h3>
            </div>
          </div>
        ) : error ? (
          <div className="record-card" style={{ justifyContent: "center", textAlign: "center" }}>
            <div className="rec-main">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="record-card" style={{ justifyContent: "center", textAlign: "center" }}>
            <div className="rec-main">
              <h3>No records yet</h3>
              <p>Your real health records will appear here once you upload or your provider adds them.</p>
              <button
                className="btn-icon"
                style={{ marginTop: 10 }}
                onClick={createDemoRecord}
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Demo Record"}
              </button>
            </div>
          </div>
        ) : (
          records.map(r => (
            <div key={r._id} className="record-card">
              <div className="rec-icon" style={{ background: '#f0f8ff' }}>{getIcon(r.type)}</div>
              <div className="rec-main">
                <h3>{r.title}</h3>
                <p>{r.doctorName || ''} · {new Date(r.visitDate || r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="rec-badge" style={{ background: '#eef7f4', color: '#0f9d74' }}>{r.type}</div>
              <div className="rec-actions">
                <button className="btn-icon" onClick={() => setSelectedRecord(r)}>View</button>
                <button className="btn-icon" onClick={() => downloadRecord(r)}>Download</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal ? (
        <div className="modal-backdrop" onClick={closeUploadModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Upload Health Record</h2>
            <form onSubmit={submitUpload}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-select" name="type" value={form.type} onChange={onFormChange}>
                    <option value="lab">Lab</option>
                    <option value="prescription">Prescription</option>
                    <option value="radiology">Radiology</option>
                    <option value="cardiac">Cardiac</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Visit Date</label>
                  <input className="form-input" type="date" name="visitDate" value={form.visitDate} onChange={onFormChange} />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Title</label>
                  <input className="form-input" type="text" name="title" value={form.title} onChange={onFormChange} placeholder="e.g. CBC Report" required />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Doctor Name</label>
                  <input className="form-input" type="text" name="doctorName" value={form.doctorName} onChange={onFormChange} placeholder="e.g. Dr. Meera Iyer" />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" name="description" value={form.description} onChange={onFormChange} placeholder="Summary of this record" />
                </div>
                <div className="form-row-full">
                  <label className="form-label">Results</label>
                  <textarea className="form-textarea" name="results" value={form.results} onChange={onFormChange} placeholder="Important findings" />
                </div>
              </div>

              {uploadError ? <p style={{ color: "#b42318", marginTop: 12 }}>{uploadError}</p> : null}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeUploadModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Record"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedRecord ? (
        <div className="modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Record Details</h2>
            <div className="details-row"><strong>Title:</strong> {selectedRecord.title}</div>
            <div className="details-row"><strong>Type:</strong> {selectedRecord.type}</div>
            <div className="details-row"><strong>Doctor:</strong> {selectedRecord.doctorName || "N/A"}</div>
            <div className="details-row"><strong>Visit Date:</strong> {selectedRecord.visitDate ? new Date(selectedRecord.visitDate).toLocaleString() : "N/A"}</div>
            <div className="details-row"><strong>Description:</strong> {selectedRecord.description || "N/A"}</div>
            <div className="details-row"><strong>Results:</strong> {selectedRecord.results || "N/A"}</div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setSelectedRecord(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}