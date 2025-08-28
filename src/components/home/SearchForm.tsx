import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
}

export function SearchForm({ searchQuery, setSearchQuery, onSearch }: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(searchQuery);
      }}
      className="flex space-x-4"
    >
      <div className="flex-1 relative">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une commune"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-16 text-lg bg-white border-0 rounded-2xl shadow-xl font-medium text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <Button
        type="submit"
        className="h-16 px-10 text-white rounded-2xl shadow-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
      >
        Explorer
      </Button>
    </form>
  );
}

