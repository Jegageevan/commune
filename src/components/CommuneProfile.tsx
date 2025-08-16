import { CommuneData } from "../services/communeData";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import { ArrowLeft, TrendingUp } from "lucide-react";
const franceMapImage = "/globe.svg";

interface CommuneProfileProps {
  commune: CommuneData;
  onBack: () => void;
}

export function CommuneProfile({ commune, onBack }: CommuneProfileProps) {
  const healthData = [
    { name: "Couvert", value: 53, color: "#14b8a6" },
    { name: "Non couvert", value: 47, color: "#0891b2" },
  ];

  const crimeBarData = [
    { name: "Vols", value: 25 },
    { name: "Violences", value: 15 },
  ];

  const evolutionData = [
    { year: "2020", value: 85 },
    { year: "2021", value: 90 },
    { year: "2022", value: 88 },
    { year: "2023", value: 95 },
    { year: "2024", value: 92 },
  ];

  const districts = [
    { name: "1er", population: "27 630", trend: "up" },
    { name: "2e", population: "27 630", trend: "up" },
    { name: "3re", population: "22 520", trend: "down" },
    { name: "4re", population: "22 520", trend: "down" },
  ];

  return (
    <div className="min-h-screen">
      <div className="gradient-blue-teal relative overflow-hidden min-h-screen">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 max-w-lg opacity-30">
          <img
            src={franceMapImage}
            alt="Carte de France"
            className="h-full w-full object-contain object-center-right france-map"
          />
        </div>

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 pt-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold text-white mb-6">
                {commune.name} ({commune.postalCode.substring(0, 2)})
              </h1>
              <div className="flex space-x-8 text-white/90 text-lg">
                <span>{(commune.population / 1000000).toFixed(2)} M hab.</span>
                <span>105 km²</span>
                <span>Dernière mise à jour : 4 juin 2025</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="data-card p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Revenu médian</h3>
                <div className="text-4xl font-bold text-teal-bright mb-4">
                  {commune.income.medianIncome.toLocaleString()} €
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                    <span>+1.5% vs dép.</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                    <span>+0.3% vs fr.</span>
                  </div>
                </div>
              </Card>

              <Card className="data-card p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">Prix immobilier</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/70">Vols</p>
                    <div className="h-16 bg-teal-bright rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Violences</p>
                    <div className="h-10 bg-blue-400 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-white/70">vs département ↗</p>
              </Card>

              <Card className="data-card p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Santé</h3>
                  <span className="text-sm text-teal-bright">vs Pontarlier</span>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-teal-bright mb-1">12</div>
                  <p className="text-sm text-white/70">médecins /10k hab.</p>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-1">7</div>
                  <p className="text-sm text-white/70">cabinets médicaux</p>
                </div>
                <div className="relative w-20 h-20 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {healthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs font-bold text-white">53%</div>
                      <div className="text-xs font-bold text-white">47%</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="data-card p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Délinquance</h3>
                <p className="text-sm text-white/70 mb-4">/1000 hab.</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crimeBarData}>
                      <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="data-card p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Santé</h3>
                <div className="text-2xl font-bold text-teal-bright mb-1">12</div>
                <p className="text-sm text-white/70 mb-4">médecins /10k hab.</p>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData.slice(0, 3)}>
                      <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="gradient-yellow-orange p-6">
                <div className="text-center">
                  <p className="text-teal-bright font-semibold mb-2">Annonce</p>
                  <div className="h-24 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-gray-800 font-bold">Annonce</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-8">
              <Button className="w-full max-w-md bg-teal-600 hover:bg-teal-700 text-white h-14 rounded-xl font-bold text-lg">
                Comparer cette commune
              </Button>
            </div>

            <Card className="data-card p-6 text-white mb-8">
              <h3 className="text-2xl font-semibold mb-6">Évolution 5 ans</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ fill: "#14b8a6", strokeWidth: 2, r: 4 }}
                    />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="data-card p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">Quartiers (arrondissements)</h3>
                  <span className="text-sm text-teal-bright">Voir la fiche</span>
                </div>
                <div className="space-y-4">
                  {districts.map((district, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold">{district.name}</span>
                        <span className="text-sm text-white/70">Population</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold">{district.population}</span>
                        <span className="text-sm text-teal-bright">Voir la fiche</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="gradient-yellow-orange p-8">
                <div className="text-center mb-4">
                  <p className="text-teal-bright font-semibold mb-4">Annonce</p>
                </div>
                <div className="bg-orange-400 rounded-2xl p-8 text-center">
                  <p className="text-gray-800 font-bold text-xl mb-2">Annonce</p>
                  <p className="text-gray-800 text-lg">300 x 600</p>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-teal-bright font-semibold">Annonce</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

