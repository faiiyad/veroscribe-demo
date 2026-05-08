export function StepIndicator({ current, steps }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < current;
          const isCurrent = stepNum === current;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isComplete ? '#2E8B7A' : isCurrent ? '#1A3C5E' : '#E5E1D8',
                  color: isComplete || isCurrent ? 'white' : '#9A8F82',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.3s ease',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(26,60,94,0.15)' : 'none',
                }}>
                  {isComplete ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : stepNum}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? '#1A3C5E' : isComplete ? '#2E8B7A' : '#9A8F82',
                  whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif",
                }}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 60, height: 2, margin: '0 8px', marginBottom: 22,
                  background: isComplete ? '#2E8B7A' : '#E5E1D8',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          );
        })}
      </div>
    );
}