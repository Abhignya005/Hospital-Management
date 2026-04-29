import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { appointmentAPI } from "../services/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f8fbff; }
  
  .doctor-appointments-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
    padding: 40px 24px;
  }
  
  .appointments-container {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .page-header {
    margin-bottom: 40px;
  }
  
  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    color: #102033;
    margin-bottom: 8px;
  }
  
  .page-subtitle {
    font-size: 15px;
    color: #5f6f87;
  }
  
  .appointments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  
  .appointment-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1.5px solid rgba(15, 23, 42, 0.08);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    transition: all 0.3s ease;
  }
  
  .appointment-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
    border-color: #0f9d74;
  }
  
  .appointment-status {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
  }
  
  .status-pending {
    background: rgba(245, 158, 11, 0.15);
    color: #b45309;
  }
  
  .status-confirmed {
    background: rgba(15, 157, 116, 0.15);
    color: #0b7d5d;
  }
  
  .status-completed {
    background: rgba(34, 197, 94, 0.15);
    color: #15803d;
  }
  
  .status-cancelled {
    background: rgba(239, 68, 68, 0.15);
    color: #b42318;
  }
  
  .appointment-patient {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }
  
  .patient-name {
    font-size: 16px;
    font-weight: 600;
    color: #102033;
    margin-bottom: 4px;
  }
  
  .patient-contact {
    font-size: 13px;
    color: #5f6f87;
  }
  
  .appointment-details {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .detail-row {
    display: flex;
    gap: 8px;
  }
  
  .detail-label {
    font-weight: 600;
    color: #5f6f87;
    min-width: 80px;
    font-size: 13px;
  }
  
  .detail-value {
    color: #102033;
    font-size: 13px;
  }
  
  .appointment-reason {
    background: rgba(15, 157, 116, 0.05);
    border-left: 3px solid #0f9d74;
    padding: 12px;
    border-radius: 6px;
    font-size: 13px;
    color: #102033;
    margin-top: 12px;
  }
  
  .reason-label {
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
    color: #0f9d74;
  }
  
  .appointment-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }
  
  .btn {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-confirm {
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: white;
  }
  
  .btn-confirm:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(15, 157, 116, 0.3);
  }
  
  .btn-cancel {
    background: rgba(239, 68, 68, 0.1);
    color: #b42318;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .btn-cancel:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 24px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #102033;
    margin-bottom: 8px;
  }
  
  .empty-message {
    font-size: 14px;
    color: #5f6f87;
  }
  
  .alert {
    padding: 14px 16px;
    border-radius: 10px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  
  .alert-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #b42318;
  }
  
  .alert-success {
    background: rgba(15, 157, 116, 0.1);
    border: 1px solid rgba(15, 157, 116, 0.2);
    color: #0b7d5d;
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

export default function DoctorAppointments() {
  injectCSS("doctor-appointments-css", CSS);
  const { authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading) return;
    fetchAppointments();
  }, [authLoading]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();
      if (response.success) {
        setAppointments(response.appointments || []);
      } else {
        setError(response.message || "Failed to fetch appointments");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      setActionLoadingId(appointmentId);
      setError("");
      setSuccess("");

      const response = await appointmentAPI.updateAppointment(appointmentId, {
        status,
      });

      if (!response.success) {
        throw new Error(response.message || 'Unable to update appointment');
      }

      setSuccess(`Appointment ${status} successfully.`);
      await fetchAppointments();
    } catch (err) {
      setError(err.message || 'Unable to update appointment');
    } finally {
      setActionLoadingId("");
    }
  };

  if (authLoading || loading) {
    return <div className="doctor-appointments-page">Loading...</div>;
  }

  return (
    <div className="doctor-appointments-page">
      <div className="appointments-container">
        <div className="page-header">
          <h1 className="page-title">Appointment Orders</h1>
          <p className="page-subtitle">
            Manage appointment requests from patients
          </p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No Appointments Yet</div>
            <div className="empty-message">
              You don't have any appointment requests at the moment.
            </div>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((apt) => (
              <div key={apt._id} className="appointment-card">
                <div
                  className={`appointment-status ${getStatusClass(
                    apt.status
                  )}`}
                >
                  {apt.status}
                </div>

                <div className="appointment-patient">
                  <div className="patient-name">
                    👤 {apt.userId?.name || "Patient"}
                  </div>
                  <div className="patient-contact">
                    📧 {apt.userId?.email || "N/A"}
                  </div>
                  <div className="patient-contact">
                    📱 {apt.userId?.phone || "N/A"}
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date:</span>
                    <span className="detail-value">
                      {formatDate(apt.appointmentDate)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🕒 Time:</span>
                    <span className="detail-value">{apt.appointmentTime}</span>
                  </div>
                </div>

                <div className="appointment-reason">
                  <span className="reason-label">Reason for Visit:</span>
                  {apt.reason}
                </div>

                {apt.notes && (
                  <div className="appointment-reason" style={{ borderLeftColor: "#2f8fb6" }}>
                    <span className="reason-label" style={{ color: "#2f8fb6" }}>
                      Notes:
                    </span>
                    {apt.notes}
                  </div>
                )}

                {apt.status === "pending" && (
                  <div className="appointment-actions">
                    <button
                      className="btn btn-confirm"
                      disabled={actionLoadingId === apt._id}
                      onClick={() => updateAppointmentStatus(apt._id, 'confirmed')}
                    >
                      {actionLoadingId === apt._id ? 'Updating...' : 'Confirm'}
                    </button>
                    <button
                      className="btn btn-cancel"
                      disabled={actionLoadingId === apt._id}
                      onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                    >
                      {actionLoadingId === apt._id ? 'Updating...' : 'Decline'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
