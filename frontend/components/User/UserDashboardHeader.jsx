import Link from 'next/link';

export function UserDashboardHeader() {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1
          className="text-[42px] font-medium italic text-black leading-tight"
          style={{ fontFamily: 'serif' }}
        >
          Your Appointments
        </h1>
        <p className="text-[#6B7280] text-[15px] mt-1">
          View and track all your upcoming and past bookings.
        </p>
      </div>

      <Link
        href="/book"
        className="light-sweep self-start mt-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
        style={{ '--sweep-color': '#000000' }}
      >
        + Book New Appointment
      </Link>
    </div>
  );
}