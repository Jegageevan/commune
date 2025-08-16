import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ onSearch, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Logo - Plus espacé */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl">CommuneData</span>
          </div>
          
          {/* Navigation Desktop - Meilleur espacement */}
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium text-lg">
              Données
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium text-lg">
              Comparer
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors font-medium text-lg">
              À propos
            </a>
          </nav>
          
          {/* Menu Hamburger Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}

