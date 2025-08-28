import { BarChart3, Building2, Plus } from "lucide-react";

export function TrendingSection() {
  return (
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
  );
}

