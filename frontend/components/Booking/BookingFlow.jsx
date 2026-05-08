'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPhysicians, getPhysicianSlots, createBooking } from '../../lib/api';
import { formatDate, formatTime, getDayLabel } from '../utils/component_utils';
import { StepIndicator } from './StepIndicator';
import { PhysicianCard } from './PhysicianCard';

// Main component
export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [physicians, setPhysicians] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingPhysicians, setLoadingPhysicians] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Selections
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Patient form
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '' });
  const [formErrors, setFormErrors] = useState({});

  // Confirmed booking
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load physicians on mount
  useEffect(() => {
    getPhysicians()
      .then(res => setPhysicians(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoadingPhysicians(false));
  }, []);

  // Load slots when physician is selected
  useEffect(() => {
    if (!selectedPhysician) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedDate(null);
    setSelectedTime(null);
    getPhysicianSlots(selectedPhysician._id)
      .then(res => setSlots(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoadingSlots(false));
  }, [selectedPhysician]);

  const timesForSelectedDate = selectedDate
    ? (slots.find(s => s.date === selectedDate)?.times || [])
    : [];

  function validateForm() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.reason.trim()) errs.reason = 'Please describe your reason for visit';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createBooking({
        physicianId: selectedPhysician._id,
        slotDate: selectedDate,
        slotTime: selectedTime,
        patientName: form.name,
        patientEmail: form.email,
        patientPhone: form.phone,
        reasonForVisit: form.reason,
      });
      setConfirmedBooking(res.data);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setStep(1);
    setSelectedPhysician(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setForm({ name: '', email: '', phone: '', reason: '' });
    setFormErrors({});
    setConfirmedBooking(null);
    setError(null);
  }

  // ── Shared layout wrapper ──────────────────────────────────────────────────
  const Wrapper = ({ children }) => (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        padding: '7rem 1rem 2rem', // 👈 key change (top padding added)
      }}
    >
      <main style={{ maxWidth: 780, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );

  // ── Step 4: Confirmation ───────────────────────────────────────────────────
  if (step === 4 && confirmedBooking) {
    return (
      <Wrapper>
        <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }} className="animate-fade-up">
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#D1FAE5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
          }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#065F46" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
            Appointment Requested
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: '2rem' }}>
            Your booking is pending confirmation from the physician's office.
          </p>

          <div style={{ background: 'white', borderRadius: 12, border: '1.5px solid #EAE6DE', padding: '1.75rem', textAlign: 'left', maxWidth: 480, margin: '0 auto 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: '#1A3C5E' }}>
                Booking Summary
              </span>
              <span className="badge-pending" style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                Pending
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              {[
                ['Physician', confirmedBooking.physicianName],
                ['Specialty', confirmedBooking.physicianSpecialty],
                ['Date', formatDate(confirmedBooking.slotDate)],
                ['Time', formatTime(confirmedBooking.slotTime)],
                ['Patient', confirmedBooking.patientName],
                ['Email', confirmedBooking.patientEmail],
                ['Reason', confirmedBooking.reasonForVisit],
                ['Booking ID', confirmedBooking._id.slice(-8).toUpperCase()],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#9A8F82', width: 90, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: '#1A1A2E', fontWeight: 500, flex: 1 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetFlow}
            style={{
              padding: '0.75rem 2rem', background: '#1A3C5E', color: 'white',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15,
            }}
          >
            Book Another Appointment
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="animate-fade-up">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#1A1A2E', marginBottom: 6, textAlign: 'center' }}>
          Book an Appointment
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: '2rem' }}>
          Choose a physician, select a time, and provide your details.
        </p>

        <StepIndicator current={step} steps={['Choose Physician', 'Select Time', 'Your Details']} />

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#991B1B', fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Step 1: Physician Selection ───────────────────────────────────── */}
        {step === 1 && (
          <div>
            {loadingPhysicians ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9A8F82' }}>
                <div style={{ fontSize: 14 }}>Loading physicians...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {physicians.map(p => (
                  <PhysicianCard
                    key={p._id}
                    physician={p}
                    onSelect={(physician) => {
                      setSelectedPhysician(physician);
                      setStep(2);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Date & Time ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            {/* Selected physician summary */}
            <div style={{
              background: 'white', borderRadius: 10, border: '1.5px solid #EAE6DE',
              padding: '1rem 1.25rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: selectedPhysician.avatarColor, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif",
                flexShrink: 0,
              }}>
                {selectedPhysician.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#1A1A2E', fontSize: 15 }}>{selectedPhysician.name}</div>
                <div style={{ fontSize: 13, color: '#2E8B7A', marginTop: 2 }}>{selectedPhysician.specialty}</div>
              </div>
              <button
                onClick={() => { setSelectedPhysician(null); setStep(1); }}
                style={{ background: 'none', border: '1px solid #E5E1D8', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12, color: '#6B7280' }}
              >
                Change
              </button>
            </div>

            {loadingSlots ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9A8F82', fontSize: 14 }}>
                Loading available times...
              </div>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 12, border: '1.5px solid #EAE6DE' }}>
                <p style={{ color: '#6B7280', fontSize: 15 }}>No available slots in the next 14 days.</p>
              </div>
            ) : (
              <>
                {/* Date strip */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#1A3C5E', marginBottom: '0.875rem' }}>
                    Select a Date
                  </h3>
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    {slots.map(slot => {
                      const { day, date, month } = getDayLabel(slot.date);
                      const isSelected = selectedDate === slot.date;
                      return (
                        <button
                          key={slot.date}
                          onClick={() => { setSelectedDate(slot.date); setSelectedTime(null); }}
                          style={{
                            flexShrink: 0, width: 68, padding: '0.75rem 0',
                            borderRadius: 10, cursor: 'pointer',
                            border: isSelected ? '2px solid #1A3C5E' : '1.5px solid #E5E1D8',
                            background: isSelected ? '#1A3C5E' : 'white',
                            color: isSelected ? 'white' : '#1A1A2E',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 500, opacity: isSelected ? 1 : 0.6 }}>{day}</span>
                          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{date}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, opacity: isSelected ? 1 : 0.6 }}>{month}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="animate-fade-in">
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#1A3C5E', marginBottom: '0.875rem' }}>
                      Select a Time
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {timesForSelectedDate.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            style={{
                              padding: '0.5rem 1.125rem', borderRadius: 8, cursor: 'pointer',
                              border: isSelected ? '2px solid #2E8B7A' : '1.5px solid #E5E1D8',
                              background: isSelected ? '#2E8B7A' : 'white',
                              color: isSelected ? 'white' : '#1A1A2E',
                              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {formatTime(time)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: '2rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '0.75rem 1.5rem', background: 'white',
                  border: '1.5px solid #E5E1D8', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: '#6B7280',
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                style={{
                  padding: '0.75rem 1.75rem', borderRadius: 8, cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                  border: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
                  background: selectedDate && selectedTime ? '#1A3C5E' : '#E5E1D8',
                  color: selectedDate && selectedTime ? 'white' : '#9A8F82',
                  transition: 'all 0.15s ease',
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Patient Details ───────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-in">
            {/* Appointment summary bar */}
            <div style={{
              background: '#EEF5F4', border: '1.5px solid #C5DDD9', borderRadius: 10,
              padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: 14,
              display: 'flex', flexWrap: 'wrap', gap: '1rem',
            }}>
              <span><strong style={{ color: '#1A3C5E' }}>{selectedPhysician.name}</strong></span>
              <span style={{ color: '#6B7280' }}>•</span>
              <span style={{ color: '#2E8B7A', fontWeight: 500 }}>{formatDate(selectedDate)}</span>
              <span style={{ color: '#6B7280' }}>•</span>
              <span style={{ color: '#2E8B7A', fontWeight: 500 }}>{formatTime(selectedTime)}</span>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1.5px solid #EAE6DE', padding: '1.75rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#1A3C5E', marginBottom: '1.5rem', marginTop: 0 }}>
                Your Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Full Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {formErrors.name && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {formErrors.email && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Phone Number <span style={{ color: '#9A8F82', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>

                {/* Reason for visit */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Reason for Visit <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Briefly describe your symptoms or reason for the appointment..."
                    value={form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    style={{ resize: 'vertical' }}
                  />
                  {formErrors.reason && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{formErrors.reason}</p>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '0.75rem 1.5rem', background: 'white',
                  border: '1.5px solid #E5E1D8', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: '#6B7280',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '0.75rem 2rem', background: '#2E8B7A', color: 'white',
                  border: 'none', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
                  opacity: submitting ? 0.7 : 1, transition: 'all 0.15s ease',
                }}
              >
                {submitting ? 'Booking...' : 'Request Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
