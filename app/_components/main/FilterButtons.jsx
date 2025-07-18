const CATEGORIES = [
  { label: "All", value: "" },
  { label: "720p", value: "720p" },
  { label: "1080p", value: "1080p" },
  { label: "Hindi Dubbed", value: "Hindi Dubbed" },
  { label: "South Indian", value: "South Indian" },
];
export default function FilterButtons({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 my-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          className={`px-4 py-1 border rounded-full ${
            selected === cat.value
              ? "bg-pink-600 border-pink-600"
              : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
          }`}
          onClick={() => onSelect(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
