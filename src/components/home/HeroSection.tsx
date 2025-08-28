import { SearchForm } from "./SearchForm";
import { QuickSearch } from "./QuickSearch";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
  onQuickSearch: (city: string) => void;
}

export function HeroSection({ searchQuery, setSearchQuery, onSearch, onQuickSearch }: HeroSectionProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16">
      <div className="max-w-2xl">
        <h1 className="text-7xl font-bold text-white mb-12 leading-tight">
          Découvrez
          <br />
          votre commune
        </h1>

        <div className="mb-8">
          <SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={onSearch} />
        </div>

        <QuickSearch cities={["Nantes", "Lyon", "Bordeaux"]} onQuickSearch={onQuickSearch} />
      </div>
    </div>
  );
}

