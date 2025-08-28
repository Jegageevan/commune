import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FeaturedCommuneCard } from "./FeaturedCommuneCard";

interface CompareSectionProps {
  compareCommune1: string;
  setCompareCommune1: (value: string) => void;
  compareCommune2: string;
  setCompareCommune2: (value: string) => void;
  onQuickSearch: (city: string) => void;
}

export function CompareSection({
  compareCommune1,
  setCompareCommune1,
  compareCommune2,
  setCompareCommune2,
  onQuickSearch,
}: CompareSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Comparer une commune</h2>
        <div className="space-y-5">
          <Input
            placeholder="Commune 1"
            value={compareCommune1}
            onChange={(e) => setCompareCommune1(e.target.value)}
            className="h-16 bg-gray-100 border-0 rounded-2xl text-gray-700 font-medium text-lg placeholder:text-gray-500"
          />
          <Input
            placeholder="Commune 2"
            value={compareCommune2}
            onChange={(e) => setCompareCommune2(e.target.value)}
            className="h-16 bg-gray-100 border-0 rounded-2xl text-gray-700 font-medium text-lg placeholder:text-gray-500"
          />
          <Button className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg">
            Comparer
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-end mb-8">
          <span className="text-sm text-gray-500 font-medium">Annonce</span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <FeaturedCommuneCard
            image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=160&fit=crop"
            alt="Châtenay-Malabry"
            name="Chatenay-Malabry"
            percent="2.8%"
            label="Annoncé"
            onClick={() => onQuickSearch("Châtenay-Malabry")}
          />
          <FeaturedCommuneCard
            image="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=160&fit=crop"
            alt="Dardilly"
            name="Dardilly"
            percent="13%"
            onClick={() => onQuickSearch("Dardilly")}
          />
          <FeaturedCommuneCard
            image="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=160&fit=crop"
            alt="Perpignan"
            name="Perpignan"
            percent="0.47%"
            onClick={() => onQuickSearch("Perpignan")}
          />
        </div>
      </div>
    </div>
  );
}

