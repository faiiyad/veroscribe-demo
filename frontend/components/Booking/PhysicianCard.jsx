export function PhysicianCard({ physician, onSelect }) {
  return (
    <div
      onClick={() => onSelect(physician)}
      className="
        flex flex-col
        h-full
        p-6
        rounded-xl
        bg-white/70 backdrop-blur-xl
        border border-white/90
        shadow-sm
        transition-all duration-200
        hover:-translate-y-1
      "
    >
      {/* Top content — grows to fill space */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-[16px] font-semibold text-gray-900 italic">
          {physician.name}
        </h3>
        <p className="text-sm font-medium text-teal-600">
          {physician.specialty}
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          {physician.bio}
        </p>
      </div>

      {/* Button pinned */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(physician);
        }}
        className="
          light-sweep
          mt-4
          self-start
          px-5 py-2
          rounded-lg
          bg-black text-white
          text-sm font-medium
          hover:opacity-80
          transition
          hover:-translate-y-0.5
        "
      >
        Select Physician →
      </button>
    </div>
  );
}