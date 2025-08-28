import { CheckCircle } from "lucide-react";

export function TrustSection() {
  return (
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
  );
}

