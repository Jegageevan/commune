'use client';

import { useState } from "react";
import { Header } from "../components/Header";
import { SearchResults } from "../components/SearchResults";
import { CommuneProfile } from "../components/CommuneProfile";
import { CommuneData, searchCommunes, getAllCommunes } from "../services/communeData";
import { HeroSection } from "../components/home/HeroSection";
import { CompareSection } from "../components/home/CompareSection";
import { TrendingSection } from "../components/home/TrendingSection";
import { TrustSection } from "../components/home/TrustSection";

const franceMapImage = "/globe.svg";

export default function Home() {
  const [appState, setAppState] = useState<"search" | "profile">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CommuneData[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<CommuneData | null>(null);
  const [compareCommune1, setCompareCommune1] = useState("");
  const [compareCommune2, setCompareCommune2] = useState("");

  const handleSearch = (query: string) => {
    const results = searchCommunes(query);
    setSearchResults(results);
  };

  const handleSelectCommune = (commune: CommuneData) => {
    setSelectedCommune(commune);
    setAppState("profile");
  };

  const handleBack = () => {
    setAppState("search");
    setSelectedCommune(null);
    setSearchResults([]);
  };

  const handleQuickSearch = (city: string) => {
    setSearchQuery(city);
    handleSearch(city);
  };

  getAllCommunes();

  if (appState === "profile" && selectedCommune) {
    return (
      <div className="min-h-screen">
        <div className="gradient-blue-teal">
          <Header onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <CommuneProfile commune={selectedCommune} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="gradient-blue-teal relative overflow-hidden min-h-[70vh]">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 max-w-lg opacity-30">
          <img
            src={franceMapImage}
            alt="Carte de France"
            className="h-full w-full object-contain object-center-right france-map"
          />
        </div>

        <Header onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onQuickSearch={handleQuickSearch}
        />

        {searchResults.length > 0 && (
          <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-t-3xl">
            <SearchResults communes={searchResults} onSelectCommune={handleSelectCommune} />
          </div>
        )}
      </div>

      {searchResults.length === 0 && (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <CompareSection
              compareCommune1={compareCommune1}
              setCompareCommune1={setCompareCommune1}
              compareCommune2={compareCommune2}
              setCompareCommune2={setCompareCommune2}
              onQuickSearch={handleQuickSearch}
            />
            <TrendingSection />
            <TrustSection />
          </div>
        </div>
      )}
    </div>
  );
}

