import { getDayLabel } from "../utils/component_utils";

export default function DateStrip({ slots, selectedDate, onSelect }) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {slots.map(slot => {
          const { day, date, month } = getDayLabel(slot.date);
          const isSelected = selectedDate === slot.date;
          return (
            <button
              key={slot.date}
              onClick={() => onSelect(slot.date)}
              className={`shrink-0 w-[78px] py-3 rounded-[10px] cursor-pointer flex flex-col items-center gap-0.5 transition-all duration-150 ease-in-out ${
                isSelected
                  ? 'light-sweep border-2 border-[#83cdf9] bg-[#000000] text-white'
                  : 'border-[1.5px] border-[#E5E1D8] bg-white text-[#1A1A2E]'
              }`}
            >
              <span className={`text-[11px] font-medium ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                {day}
              </span>
              <span className="text-[20px] font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                {date}
              </span>
              <span className={`text-[11px] font-medium ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                {month}
              </span>
            </button>
          );
        })}
      </div>
    );
}