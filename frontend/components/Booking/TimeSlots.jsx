import { formatTime } from '../utils/component_utils';

export default function TimeSlots({ times, selectedTime, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {times.map(time => {
        const isSelected = selectedTime === time;
        return (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={`py-2 px-[1.125rem] rounded-lg cursor-pointer font-bold text-sm transition-all duration-150 ease-in-out ${
                isSelected
                ? 'light-sweep border-2 border-[#83cdf9] bg-[#000000] text-white'
                : 'border-[1.5px] border-[#E5E1D8] bg-white text-[#1A1A2E]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}