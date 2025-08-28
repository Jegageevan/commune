import { Card } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface FeaturedCommuneCardProps {
  image: string;
  alt: string;
  name: string;
  percent: string;
  label?: string;
  onClick: () => void;
}

export function FeaturedCommuneCard({ image, alt, name, percent, label, onClick }: FeaturedCommuneCardProps) {
  return (
    <Card
      className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-lg"
      onClick={onClick}
    >
      <div className="relative">
        <ImageWithFallback src={image} alt={alt} className="w-full h-32 object-cover" />
        {label && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-400 text-black text-xs px-3 py-1.5 rounded-lg font-bold">{label}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-base mb-3 text-gray-900">{name}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full" />
          <span className="text-base font-semibold text-gray-700">{percent}</span>
        </div>
      </div>
    </Card>
  );
}

