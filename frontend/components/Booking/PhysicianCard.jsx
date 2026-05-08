export function PhysicianCard({ physician, onSelect }) {
    return (
      <div
        onClick={() => onSelect(physician)}
        style={{
          background: 'white',
          border: '1.5px solid #EAE6DE',
          borderRadius: 12,
          padding: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
        className="card-hover"
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E8B7A'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EAE6DE'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: physician.avatarColor || '#1A3C5E',
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 17,
            fontFamily: "'Playfair Display', serif",
            flexShrink: 0,
          }}>
            {physician.initials}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 16, color: '#1A1A2E' }}>
              {physician.name}
            </div>
            <div style={{ fontSize: 13, color: '#2E8B7A', fontWeight: 500, marginTop: 2 }}>
              {physician.specialty}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
          {physician.bio}
        </p>
        <button style={{
          marginTop: 4, padding: '0.5rem 1.25rem',
          background: '#1A3C5E', color: 'white',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
          alignSelf: 'flex-start',
        }}>
          Select Physician →
        </button>
      </div>
    );
}