'use client';

import { useState, useEffect } from 'react';
import { getPhysicians, getPhysicianSlots, createBooking } from '../../lib/api';
import { formatDate, formatTime } from '../utils/component_utils';
import { StepIndicator } from './StepIndicator';
import { PhysicianCard } from './PhysicianCard';
import DateStrip from './DateStrip';
import TimeSlots from './TimeSlots';
import PatientDetailsStep from './PatientDetailSetup';
import BookingConfirmation from './BookingConfirmation';


const Wrapper = ({ children }) => (
  <div className="min-h-screen bg-transparent pt-28 px-4 pb-8">
    <main className="max-w-[780px] mx-auto">
      {children}
    </main>
  </div>
);

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

  // ── Step 4: Confirmation ───────────────────────────────────────────────────
  if (step === 4 && confirmedBooking) {
    return (
      <Wrapper>
        <BookingConfirmation confirmedBooking={confirmedBooking} onReset={resetFlow} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="animate-fade-up">
        <h1 className="font-serif text-[50px] font-medium text-[#1A1A2E] mb-[6px] text-center italic">
          Book an appointment
        </h1>
        <p className="text-[#6B7280] text-[15px] text-center mb-8">
          Choose a physician, select a time, and provide your details.
        </p>

        <StepIndicator current={step} steps={['Choose Physician', 'Select Time', 'Your Details']} />

        {error && (
          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg py-3.5 px-4 mb-6 text-[#991B1B] text-sm">
            ⚠ {error}
          </div>
        )}

        {/* ── Step 1: Physician Selection ───────────────────────────────────── */}
        {step === 1 && (
          <div>
            {loadingPhysicians ? (
              <div className="text-center p-12 text-[#9A8F82]">
                <div className="text-sm">Loading physicians...</div>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
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
            {loadingSlots ? (
              <div className="text-center p-12 text-[#9A8F82] text-sm">
                Loading available times...
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-xl border-[1.5px] border-[#EAE6DE]">
                <p className="text-[#6B7280] text-[15px]">No available slots in the next 14 days.</p>
              </div>
            ) : (
              <>
                {/* Date strip */}
                <div className="mb-6">
                  <h3
                    className="text-base text-[50px] font-serif font-extrabold text-black mb-3.5 italic"
                  >
                    Select a date
                  </h3>
                  <DateStrip
                    slots={slots}
                    selectedDate={selectedDate}
                    onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                  />
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="animate-fade-in">
                    <h3
                      className="text-base text-[50px] font-serif font-extrabold text-black mb-3.5 italic"
                    >
                      Select a time
                    </h3>
                    <TimeSlots
                      times={timesForSelectedDate}
                      selectedTime={selectedTime}
                      onSelect={setSelectedTime}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="light-sweep py-3 px-6 bg-white border-[1.5px] border-[#110c00] rounded-lg cursor-pointer font-medium text-sm text-[#ffffff]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`py-3 px-7 rounded-lg border-none font-medium text-sm transition-all duration-150 ease-in-out ${
                  selectedDate && selectedTime
                    ? 'light-sweep bg-[#000000] text-white cursor-pointer'
                    : 'bg-[#E5E1D8] text-[#9A8F82] cursor-not-allowed'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Patient Details ───────────────────────────────────────── */}
        {step === 3 && (
          <PatientDetailsStep
            selectedPhysician={selectedPhysician}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            form={form}
            formErrors={formErrors}
            submitting={submitting}
            onFormChange={(field, value) => setForm(f => ({ ...f, [field]: value }))}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </Wrapper>
  );
}