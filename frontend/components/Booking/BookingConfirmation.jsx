import { formatDate, formatTime } from '../utils/component_utils';

export default function BookingConfirmation({ confirmedBooking, onReset }) {
  const rows = [
    ['Physician', confirmedBooking.physicianName],
    ['Specialty', confirmedBooking.physicianSpecialty],
    ['Date',      formatDate(confirmedBooking.slotDate)],
    ['Time',      formatTime(confirmedBooking.slotTime)],
    ['Patient',   confirmedBooking.patientName],
    ['Email',     confirmedBooking.patientEmail],
    ['Reason',    confirmedBooking.reasonForVisit],
    ['Booking ID',confirmedBooking._id.slice(-8).toUpperCase()],
  ];

  return (
    <div className="text-center pt-4 pb-8 animate-fade-up">

      {/* Check icon */}
      <div className="w-[72px] h-[72px] rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#065F46" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1
        className="text-[38px] font-boldy text-[#1A1A2E] mb-2 italic"
        style={{ fontFamily: "serif" }}
      >
        Appointment Requested
      </h1>
      <p className="text-[#6B7280] text-[15px] mb-8">
        Your booking is pending confirmation from the physician's office.
      </p>

      {/* Summary card */}
      <div className="bg-white/70 rounded-xl border-[1.5px] border-[#0ab6ff] p-7 text-left max-w-[480px] mx-auto mb-8">
        <div className="flex justify-between items-center mb-5">
          <span
            className="font-semibold text-[15px] text-[#1A3C5E]"
            style={{ fontFamily: "'Inter', serif" }}
          >
            Booking Summary
          </span>
          <span className="badge-pending py-[3px] px-3 rounded-[20px] text-xs font-semibold">
            Pending
          </span>
        </div>

        <div className="flex flex-col gap-3 text-sm">
            {rows.map(([label, value]) => (
                <div key={label} className="flex gap-3">
                <span className="text-[#225671] w-[90px] shrink-0">
                    {label}
                </span>

                {label === "Booking ID" ? (
                    <span className="text-[#50b3ff] font-bold flex-1 text-xl">
                    {value}
                    </span>
                ) : (
                    <span className="text-black font-medium flex-1 text-base">
                    {value}
                    </span>
                )}
                </div>
            ))}
        </div>
        </div>

      <button
        onClick={onReset}
        className="light-sweep py-3 px-8 bg-[#000000] text-white border-none rounded-lg cursor-pointer font-bold text-[15px]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Book Another Appointment
      </button>

    </div>
  );
}