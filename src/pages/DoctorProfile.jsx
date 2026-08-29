import { Link, useLoaderData, useNavigate } from "react-router-dom";
import useDateSlotPicker from "../hooks/useDateSlotPicker";
import useBookingStatus from "../hooks/useBookingStatus";
import { memo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAppointment } from "../api/appointments";

const days = [
  { dow: "Sun", dom: 20, slots: 4, disabled: true },
  { dow: "Tue", dom: 21, slots: 4, disabled: false },
  { dow: "Wed", dom: 22, slots: 4, disabled: false },
  { dow: "Tue", dom: 23, slots: 6, disabled: false },
  { dow: "Wed", dom: 24, slots: 3, disabled: false },
  { dow: "Thu", dom: 25, slots: 0, disabled: true },
  { dow: "Fri", dom: 26, slots: 5, disabled: false },
  { dow: "Sat", dom: 27, slots: 3, disabled: false },
  { dow: "Sun", dom: 28, slots: 0, disabled: true },
  { dow: "Sun", dom: 29, slots: 0, disabled: true },
  { dow: "Sun", dom: 30, slots: 0, disabled: true },
];

const slotsByDay = {
  Mon: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"],
  Tue: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:30 AM", "01:00 PM"],
  Wed: ["10:00 AM", "02:00 PM", "07:00 PM", "8:00 AM"],
  Fri: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
  Sat: ["09:00 AM", "10:30 AM", "02:00 PM"],
};
export default function DoctorProfile() {
  const doctor = useLoaderData();
  const { bookingProp } = useBookingStatus();
  const { slotProp } = useDateSlotPicker(
    days,
    slotsByDay,
    bookingProp.onSelect,
  );

  return (
    <>
      <div className="profile-layout">
        <BackToDoctors />

        <div className="profile-main">
          <ProfileHeaderCard doctor={doctor} />
          <AboutSection doctor={doctor} />
          <MapSection doctor={doctor} />
          <TimeSlotsSection
            slotProp={slotProp}
            bookingProp={bookingProp}
            doctor={doctor}
          />
        </div>

        <BookAppointment
          selectedDate={
            bookingProp.status === "confirmed" ? slotProp.selectedDate : null
          }
          selectedSlot={
            bookingProp.status === "confirmed" ? slotProp.selectedSlot : null
          }
          doctor={doctor}
          status={bookingProp.status}
        />
      </div>
    </>
  );
}
function BackToDoctors() {
  return (
    <span className="back-link">
      <Link to="/doctors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-left size-4"
          ariaHidden="true"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        Back to doctors
      </Link>
    </span>
  );
}
const ProfileHeaderCard = memo(function ({ doctor }) {
  return (
    <div className="profile-header-card card">
      <div className="profile-header-top">
        <div className="profile-avatar">
          <img src={doctor.avatar} alt={doctor.name} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="profile-name-row">
            <div className="profile-name">{doctor.name}</div>
            {doctor.available ? (
              <span className="badge badge-success">Available</span>
            ) : (
              <span className="badge badge-secondary">Unavailable</span>
            )}
          </div>
          <div className="profile-specialty">{doctor.specialty}</div>
          <div className="profile-meta">
            <span>
              ⭐ {doctor.rating} ({doctor.reviews} reviews)
            </span>
            <span>
              {" "}
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75V14.15M20.25 14.15a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75m16.5 0a.75.75 0 01-.75-.75V8.25m-15 5.15a.75.75 0 01-.75-.75V8.25m15 0H3.75M12 3v3.75m0 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 103 0"
                />
              </svg>{" "}
              {doctor.experience} years experience
            </span>
            <span>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {doctor.city}
            </span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-outline btn-icon">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <button className="btn btn-outline btn-icon">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="profile-divider"></div>
      <div className="profile-detail-grid">
        <div>
          <div className="profile-detail-label">
            <h3>Languages spoken</h3>
          </div>
          <div className="tag-list">
            {doctor.languages.split(",").map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="profile-detail-label">
            <h3>Insurance accepted</h3>
          </div>
          <div className="tag-list">
            {doctor.insurance.split(", ").map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
function AboutSection({ doctor }) {
  return (
    <div className="section-card card">
      <div className="section-card-title">About</div>
      <div className="about-text">{doctor.about}</div>
    </div>
  );
}
function MapSection({ doctor }) {
  return (
    <div className="section-card card">
      <h3 className="section-card-title">Clinic location</h3>
      <div className="clinic-address">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <span>{doctor.address}</span>
      </div>
      <div className="map-placeholder">
        <img src="/clinic-map.png" alt="" />
        <div className="map-pin">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </div>
        <button className="btn btn-outline btn-sm get-directions-btn">
          Get directions
        </button>
      </div>
    </div>
  );
}

function TimeSlotsSection({ slotProp, bookingProp, doctor }) {
  const {
    selectedDate,
    onDateSelect,
    selectedSlot,
    onSelectedSlot,
    startIndex,
    onNextIndex,
    onPrevIndex,
    visibleDays,
    morningSlots,
    afternoonSlots,
  } = slotProp;
  const { status, onConfirm, onEdit } = bookingProp;
  return (
    <div className="section-card card">
      <h3 className="section-card-title">Available time slots</h3>

      <div
        className={`date-strip ${status === "confirmed" ? "slots-confirmed" : ""}`}
      >
        <button
          className="btn btn-outline btn-icon-lg date-nav-btn"
          onClick={() => onNextIndex()}
          disabled={startIndex === 0}
        >
          ‹
        </button>
        {visibleDays.map((day) => (
          <div
            key={day.dom}
            className={`date-chip ${selectedDate?.dom === day.dom ? "selected" : ""} ${day.disabled ? "disabled" : ""}`}
            onClick={() => onDateSelect(day)}
          >
            <span className="dow">{day.dow}</span>
            <span className="dom">{day.dom}</span>
            <span className="avail">
              {day.disabled ? "Full" : `${day.slots} open`}
            </span>
          </div>
        ))}
        <button
          className="btn btn-outline btn-icon-lg date-nav-btn"
          onClick={() => onPrevIndex()}
          disabled={startIndex + 7 >= days.length}
        >
          ›
        </button>
      </div>

      {morningSlots.length > 0 && (
        <div className="slot-period">
          <div className="slot-period-title">☀️ Morning</div>
          <div
            className={`slot-grid ${status === "confirmed" ? "slots-confirmed" : ""}`}
          >
            {morningSlots.map((slot) => (
              <button
                key={slot}
                className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                onClick={() => onSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {afternoonSlots.length > 0 && (
        <div
          className={`slot-period ${status === "confirmed" ? "slots-confirmed" : ""}`}
        >
          <div className="slot-period-title">🌤️ Afternoon</div>
          <div className="slot-grid">
            {afternoonSlots.map((slot) => (
              <button
                key={slot}
                className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                onClick={() => onSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="booking-actions">
        {status === "selecting" && (
          <button
            className="btn btn-default btn-lg btn-full"
            onClick={onConfirm}
          >
            Confirm selection
          </button>
        )}
        {status === "confirmed" && (
          <button
            className="btn btn-outline btn-lg btn-full"
            onClick={() => onEdit(doctor)}
          >
            Edit selection
          </button>
        )}
      </div>
    </div>
  );
}
function BookAppointment({ doctor, selectedDate, selectedSlot, status }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const doc = useLoaderData();
  const [bookingError, setBookingError] = useState("");

  async function handleConfirm() {
    if (!session) {
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError("Please select a date and time before confirming.");
      return;
    }

    const dateStr = `2026-07-${String(selectedDate.dom).padStart(2, "0")}`;

    try {
      setBookingError("");
      await createAppointment(
        doc.id,
        dateStr,
        selectedSlot,
        doc.address,
        doc.price,
        "upcoming",
        session.user.id,
      );
      navigate("/appointments");
    } catch (err) {
      setBookingError(err.message);
    }
  }

  return (
    <div className="booking-card card">
      <div className="booking-card-title">Book appointment</div>
      <div className="booking-card-sub">
        Review your selection before confirming.
      </div>

      <div className="booking-doctor-row">
        <img src={doctor.avatar} alt={doctor.name} />
        <div>
          <div className="name">{doctor.name}</div>
          <div className="specialty">{doctor.specialty}</div>
        </div>
      </div>

      <div className="booking-detail-row">
        <span className="label">Date</span>
        <span className="value">{selectedDate?.dow}</span>
      </div>
      <div className="booking-detail-row">
        <span className="label">Time</span>
        <span className="value">{selectedSlot}</span>
      </div>
      <div className="booking-detail-row">
        <span className="label">Location</span>
        <span className="value">In-clinic</span>
      </div>
      <div className="booking-detail-row total">
        <span className="label">Total</span>
        <span className="value">${doctor.price}</span>
      </div>

      {bookingError && <div className="login-error">{bookingError}</div>}

      <button
        className={`btn btn-default btn-lg`}
        disabled={status !== "confirmed"}
        onClick={handleConfirm}
      >
        ✓ Confirm appointment
      </button>
      <div className="booking-card-note">
        Free cancellation up to 24 hours before.
      </div>
    </div>
  );
}
