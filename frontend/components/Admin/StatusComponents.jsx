const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'badge-pending'   },
  confirmed: { label: 'Confirmed', className: 'badge-confirmed' },
  cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`${cfg.className} py-[3px] px-2.5 rounded-[20px] text-xs font-semibold inline-block`}>
      {cfg.label}
    </span>
  );
}

export function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#358cc4] rounded-[10px] border-[1.5px] border-[#bbc9e2] py-5 px-6 flex-[1_1_140px]">
      <div
        className="text-[28px] font-bold"
        style={{ fontFamily: "'Inter', sans-serif", color }}
      >
        {value}
      </div>
      <div className="text-[13px] text-[#ffffff] mt-1 font-bold">{label}</div>
    </div>
  );
}