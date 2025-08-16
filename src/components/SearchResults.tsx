import { CommuneData } from "../services/communeData";
import { Card } from "./ui/card";

interface SearchResultsProps {
  communes: CommuneData[];
  onSelectCommune: (commune: CommuneData) => void;
}

export function SearchResults({ communes, onSelectCommune }: SearchResultsProps) {
  if (communes.length === 0) return null;
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ul className="space-y-4">
        {communes.map((c) => (
          <li key={c.id}>
            <Card
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectCommune(c)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-gray-500">{c.postalCode}</span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

