import Link from 'next/link';
import { BookingRow } from './BookingRow';

const HEADERS = ['Patient', 'Physician', 'Date & Time', 'Reason', 'Status', 'Actions'];

export function BookingsTable({ bookings, loading, updatingId, onStatusChange }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border-[1.5px] border-[#EAE6DE] overflow-hidden">
        <div className="p-12 text-center text-[#9A8F82] text-sm">
          Loading appointments...
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-black rounded-xl border-[1.5px] border-[#000000] overflow-hidden">
        <div className="p-16 text-center">
          <p className="text-[#ffffff] text-[15px]">No appointments found.</p>
          <Link href="/book" className="text-sm text-[#ffffff] font-medium">
            Book the first one →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl border-[1.5px] border-[#EAE6DE] overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <thead>
            <tr className="bg-[#358cc4] border-b-[1.5px] border-[#EAE6DE]">
              {HEADERS.map(h => (
                <th
                  key={h}
                  className="py-3.5 px-4 text-left text-xs font-bold text-[#ffffff] uppercase tracking-[0.05em] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <BookingRow
                key={booking._id}
                booking={booking}
                updatingId={updatingId}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}