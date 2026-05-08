import { formatDate, formatTime } from '../utils/component_utils';

export default function PatientDetailsStep({
  selectedPhysician,
  selectedDate,
  selectedTime,
  form,
  formErrors,
  submitting,
  onFormChange,
  onBack,
  onSubmit,
}) {
  return (
    <div className="animate-fade-in">

      {/* Appointment summary bar */}
      <div className="bg-[#ffffff]/60 border-[1.5px] border-[#bee0f6] rounded-[10px] py-4 px-5 mb-6 flex flex-wrap gap-4 text-l">
        <span><strong className="text-black font-bold ">{selectedPhysician.name}</strong></span>
        <span className="text-black/40">•</span>
        <span className="text-[#00365a] font-medium">{formatDate(selectedDate)}</span>
        <span className="text-black/40">•</span>
        <span className="text-[#00365a] font-medium">{formatTime(selectedTime)}</span>
      </div>

      {/* Form card */}
      <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/30 p-7 shadow-xs">
        <h3
          className="text-[28px] font-semibold text-black mb-6 mt-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Your Details
        </h3>

        <div className="grid grid-cols-2 gap-5">

          {/* Full Name */}
          <div className="col-span-2">
            <label className="font-serif block text-[13px] font-semibold text-black mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Jane Smith"
              value={form.name}
              onChange={e => onFormChange('name', e.target.value)}
            />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="font-serif block text-[13px] font-semibold text-black mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="jane@example.com"
              value={form.email}
              onChange={e => onFormChange('email', e.target.value)}
            />
            {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="font-serif block text-[13px] font-semibold text-black mb-1.5">
              Phone Number <span className="text-black/40 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={e => onFormChange('phone', e.target.value)}
            />
          </div>

          {/* Reason for visit */}
          <div className="col-span-2">
            <label className="font-serif block text-[13px] font-semibold text-black mb-1.5">
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              className="form-input resize-y"
              rows={4}
              placeholder="Briefly describe your symptoms or reason for the appointment..."
              value={form.reason}
              onChange={e => onFormChange('reason', e.target.value)}
            />
            {formErrors.reason && <p className="text-xs text-red-500 mt-1">{formErrors.reason}</p>}
          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="light-sweep py-3 px-6 bg-black border-[1.5px] border-black rounded-lg cursor-pointer font-medium text-sm text-white"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className={`py-3 px-8 bg-black text-white border-none rounded-lg font-semibold text-[15px] transition-all duration-150 ease-in-out ${
            submitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {submitting ? 'Booking...' : 'Request Appointment'}
        </button>
      </div>

    </div>
  );
}