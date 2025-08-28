interface QuickSearchProps {
  cities: string[];
  onQuickSearch: (city: string) => void;
}

export function QuickSearch({ cities, onQuickSearch }: QuickSearchProps) {
  return (
    <div className="flex space-x-4">
      {cities.map((city) => (
        <button
          key={city}
          onClick={() => onQuickSearch(city)}
          className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium text-lg"
        >
          {city}
        </button>
      ))}
    </div>
  );
}

