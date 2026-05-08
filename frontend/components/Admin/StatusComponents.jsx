const STATUS_CONFIG = {
    pending: { label: 'Pending', className: 'badge-pending' },
    confirmed: { label: 'Confirmed', className: 'badge-confirmed' },
    cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
  };
  
export function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span
        className={cfg.className}
        style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' }}
      >
        {cfg.label}
      </span>
    );
  }
  
export function StatCard({ label, value, color }) {
    return (
      <div style={{
        background: 'white', borderRadius: 10, border: '1.5px solid #EAE6DE',
        padding: '1.25rem 1.5rem', flex: '1 1 140px',
      }}>
        <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 13, color: '#9A8F82', marginTop: 4 }}>{label}</div>
      </div>
    );
  }