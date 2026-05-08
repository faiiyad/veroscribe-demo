import { formatDate, formatTime } from '../utils/component_utils';
import { StatusBadge } from '../Admin/StatusComponents';

export function UserAppointmentCard({ booking }) {
  const initials =
    booking.physician?.initials ||
    booking.physicianName?.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div className="bg-white rounded-xl border-[1.5px] border-[#bee0f6] flex flex-col overflow-hidden">

      {/* Card header */}
      <div className="bg-[#bee0f6]/20 px-5 py-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold text-white"
          style={{ background: booking.physician?.avatarColor || '#000000' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[15px] text-black truncate">
            {booking.physicianName}
          </div>
          <div className="text-[13px] text-[#6B7280]">{booking.physicianSpecialty}</div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Date & time */}
      <div className="px-5 py-3 flex items-center gap-4 border-b border-[#bee0f6]/50">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-[#6B7280]">📅</span>
          <span className="font-medium text-black">{formatDate(booking.slotDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-[#6B7280]">🕐</span>
          <span className="font-medium text-black">{formatTime(booking.slotTime)}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="px-5 py-4 flex-1">
        <p className="text-[13px] text-[#6B7280] font-medium mb-1">Reason for visit</p>
        <p
          className="text-sm text-black leading-snug"
          style={{
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}
        >
          {booking.reasonForVisit}
        </p>
      </div>

      {/* Booking ID footer */}
      <div className="px-5 py-2.5 bg-[#bee0f6]/10 border-t border-[#bee0f6]/50">
        <span className="text-[11px] text-[#9A8F82] font-mono">
          ID: {booking._id.slice(-8).toUpperCase()}
        </span>
      </div>

    </div>
  );
}