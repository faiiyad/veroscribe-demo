import { formatDate, formatTime } from '../utils/component_utils';
import { StatusBadge } from './StatusComponents';

export function BookingRow({ booking, updatingId, onStatusChange }) {
  const isUpdating = updatingId === booking._id;

  return (
    <tr className={`border-b border-[#F0ECE5] last:border-b-0 transition-colors duration-200 ${isUpdating ? 'bg-[#FAFAF7]' : 'bg-white'}`}>

      {/* Patient */}
      <td className="p-4 min-w-[160px]">
        <div className="font-semibold text-sm text-[#1A1A2E]">{booking.patientName}</div>
        <div className="text-xs text-[#9A8F82] mt-0.5">{booking.patientEmail}</div>
        {booking.patientPhone && (
          <div className="text-xs text-[#9A8F82]">{booking.patientPhone}</div>
        )}
      </td>

      {/* Physician */}
      <td className="p-4 min-w-[180px]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full shrink-0 text-white flex items-center justify-center text-[11px] font-bold"
            style={{ background: booking.physician?.avatarColor || '#1A3C5E' }}
          >
            {booking.physician?.initials || booking.physicianName?.split(' ').map(n => n[0]).slice(1, 3).join('')}
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#1A1A2E]">{booking.physicianName}</div>
            <div className="text-[11px] text-[#358cc4]">{booking.physicianSpecialty}</div>
          </div>
        </div>
      </td>

      {/* Date & Time */}
      <td className="p-4 min-w-[160px] whitespace-nowrap">
        <div className="text-[13px] font-bolder text-[#000000]">{formatDate(booking.slotDate)}</div>
        <div className="text-xs text-[#358cc4] font-bold mt-0.5">{formatTime(booking.slotTime)}</div>
      </td>

      {/* Reason */}
      <td className="p-4 max-w-[220px]">
        <div
          className="text-[13px] text-[#6B7280] leading-snug"
          style={{
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}
        >
          {booking.reasonForVisit}
        </div>
      </td>

      {/* Status */}
      <td className="p-4 whitespace-nowrap">
        <StatusBadge status={booking.status} />
        {booking.adminNotes && (
          <div className="text-[11px] text-[#9A8F82] mt-1 italic">{booking.adminNotes}</div>
        )}
      </td>

      {/* Actions */}
      <td className="p-4 whitespace-nowrap">
      <div className="flex gap-1.5">
        {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
            <button
            onClick={() => onStatusChange(booking._id, 'confirmed')}
            disabled={isUpdating}
            style={{ '--sweep-color': '#D1FAE5' }}
            className={`light-sweep py-[5px] px-2.5 rounded-md cursor-pointer text-xs border-[1.5px] border-[#A7F3D0] text-[#065F46] font-semibold ${isUpdating ? 'opacity-60' : 'opacity-100'}`}
            >
            Confirm
            </button>
        )}
        {booking.status !== 'cancelled' && (
            <button
            onClick={() => onStatusChange(booking._id, 'cancelled')}
            disabled={isUpdating}
            style={{ '--sweep-color': '#FEE2E2' }}
            className={`light-sweep py-[5px] px-2.5 rounded-md cursor-pointer text-xs border-[1.5px] border-[#FECACA] text-[#991B1B] font-semibold ${isUpdating ? 'opacity-60' : 'opacity-100'}`}
            >
            Cancel
            </button>
        )}
        {booking.status === 'cancelled' && (
            <button
            onClick={() => onStatusChange(booking._id, 'pending')}
            disabled={isUpdating}
            style={{ '--sweep-color': '#FEF3C7' }}
            className={`light-sweep py-[5px] px-2.5 rounded-md cursor-pointer text-xs border-[1.5px] border-[#FDE68A] text-[#92400E] font-semibold ${isUpdating ? 'opacity-60' : 'opacity-100'}`}
            >
            Restore
            </button>
        )}
        </div>
      </td>

    </tr>
  );
}