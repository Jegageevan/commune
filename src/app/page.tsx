'use client';

import { useState } from "react";
import { Header } from "../components/Header";
import { SearchResults } from "../components/SearchResults";
import { CommuneProfile } from "../components/CommuneProfile";
import { CommuneData, searchCommunes, getAllCommunes } from "../services/communeData";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, BarChart3, Building2, Plus, CheckCircle } from "lucide-react";

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
          <img src={franceMapImage} alt="Carte de France" className="h-full w-full object-contain object-center-right france-map" />
        </div>

        <Header onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16">
          <div className="max-w-2xl">
            <h1 className="text-7xl font-bold text-white mb-12 leading-tight">
              Découvrez<br />
              votre commune
            </h1>

            <div className="mb-8">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="flex space-x-4">
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
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleQuickSearch('Nantes')}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium text-lg"
              >
                Nantes
              </button>
              <button
                onClick={() => handleQuickSearch('Lyon')}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium text-lg"
              >
                Lyon
              </button>
              <button
                onClick={() => handleQuickSearch('Bordeaux')}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium text-lg"
              >
                Bordeaux
              </button>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-t-3xl">
            <SearchResults communes={searchResults} onSelectCommune={handleSelectCommune} />
          </div>
        )}
      </div>

      {searchResults.length === 0 && (
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
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
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-lg" onClick={() => handleQuickSearch('Châtenay-Malabry')}>
                    <div className="relative">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=160&fit=crop"
                        alt="Châtenay-Malabry"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-400 text-black text-xs px-3 py-1.5 rounded-lg font-bold">
                          Annoncé
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-3 text-gray-900">Chatenay-Malabry</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-base font-semibold text-gray-700">2.8%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-lg" onClick={() => handleQuickSearch('Dardilly')}>
                    <div className="relative">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=160&fit=crop"
                        alt="Dardilly"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-3 text-gray-900">Dardilly</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-base font-semibold text-gray-700">13%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-lg" onClick={() => handleQuickSearch('Perpignan')}>
                    <div className="relative">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&h=160&fit=crop"
                        alt="Perpignan"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-3 text-gray-900">Perpignan</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-base font-semibold text-gray-700">0.47%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Top tendances</h2>
                <span className="text-sm text-gray-500 font-medium">Annonce</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">INSEE</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Ministère de l'intérieur</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <Plus className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Santé</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <div className="gradient-yellow-orange rounded-3xl p-12 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Pourquoi nous faire confiance</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-gray-900" />
                    <span className="text-gray-900 font-semibold text-lg">Faits marquant</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-gray-900" />
                    <span className="text-gray-900 font-semibold text-lg">Évaluation par Ministre de la Santé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

