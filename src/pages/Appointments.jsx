import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cancelAppointment, getMyAppointments } from "../api/appointments";

const TABS = ["upcoming", "past", "cancelled"];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);

  useEffect(function () {
    async function getData() {
      const appointments = await getMyAppointments();
      setAppointments(appointments);
    }
    getData();
  }, []);
  const counts = {
    upcoming: appointments.filter((a) => a.status === "upcoming").length,
    past: appointments.filter((a) => a.status === "past").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const visible = appointments.filter((a) => a.status === activeTab);

  async function handleCancel(id) {
    await cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
    );
  }

  return (
    <div className="appointments-page">
      <div className="appointments-head">
        <div>
          <h1 className="appointments-title">My Appointments</h1>
          <p className="appointments-sub">
            Manage your upcoming and past visits.
          </p>
        </div>
        <Link to="/doctors" className="btn btn-default btn-lg">
          Book new appointment
        </Link>
      </div>

      <div className="tabs-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="appointments-list">
        {visible.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          visible.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}
function AppointmentCard({ appt, onCancel }) {
  const doctor = appt.doctors;
  return (
    <div className="appointment-card card">
      <div className="appt-avatar">
        <img src={doctor.avatar} alt={doctor.name} />
      </div>

      <div className="appt-info">
        <div className="appt-name-row">
          <span className="appt-name">{doctor.name}</span>
          {appt.status === "upcoming" && (
            <span className="badge badge-success">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Confirmed
            </span>
          )}
          {appt.status === "cancelled" && (
            <span className="badge badge-destructive">Cancelled</span>
          )}
        </div>

        <div className="appt-specialty">{doctor.specialty}</div>

        <div className="appt-meta-row">
          <span>{appt.date}</span>
          <span>{appt.time}</span>
          <span>{appt.location}</span>
        </div>
      </div>

      {appt.status === "upcoming" && (
        <div className="appt-actions">
          <button className="btn btn-outline btn-sm">Edit</button>
          <button
            className="btn btn-destructive btn-sm"
            onClick={() => onCancel(appt.id)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }) {
  const messages = {
    upcoming: "You have no upcoming appointments.",
    past: "No past appointments found.",
    cancelled: "No cancelled appointments.",
  };
  return (
    <div className="empty-state">
      <svg
        className="empty-state-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="empty-state-title">{messages[tab]}</h3>
      <p className="empty-state-desc">
        {tab === "upcoming" && "Book an appointment to get started."}
        {tab === "past" && "Your completed visits will appear here."}
        {tab === "cancelled" && "Cancelled appointments will appear here."}
      </p>
      {tab === "upcoming" && (
        <div className="empty-state-action">
          <Link to="/doctors" className="btn btn-default">
            Find a Doctor
          </Link>
        </div>
      )}
    </div>
  );
}
