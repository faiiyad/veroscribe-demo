export function DashboardFilters({
    filterStatus,
    filterPhysician,
    physicians,
    onStatusChange,
    onPhysicianChange,
    onClear,
    onRefresh,
  }) {
    const selectClass = `
      py-1.5 px-3 rounded-[7px] border-[1.5px] border-[#E5E1D8]
      text-[13px] text-[#374151] bg-white cursor-pointer
    `;
  
    return (
      <div className="bg-black rounded-[10px] border-[1.5px] border-[#333436] py-4 px-5 mb-5 flex gap-3 flex-wrap items-center">
        <span className="text-[13px] font-semibold text-[#ffffff]">Filter:</span>
  
        <select
          value={filterStatus}
          onChange={e => onStatusChange(e.target.value)}
          className={selectClass}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
  
        <select
          value={filterPhysician}
          onChange={e => onPhysicianChange(e.target.value)}
          className={selectClass}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <option value="">All Physicians</option>
          {physicians.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
  
        {(filterStatus || filterPhysician) && (
          <button
            onClick={onClear}
            className="text-xs text-[#7fbadf] bg-transparent border-none cursor-pointer underline"
          >
            Clear filters
          </button>
        )}
  
        <button
          onClick={onRefresh}
          className="ml-auto py-1.5 px-3.5 bg-[#358cc4] border-[1.5px] border-[#D1DCE8] rounded-[7px] cursor-pointer text-[13px] text-[#ffffff] font-medium"
        >
          ↻ Refresh
        </button>
      </div>
    );
  }