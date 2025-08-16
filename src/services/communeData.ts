export interface CommuneData {
  id: string;
  name: string;
  postalCode: string;
  department: string;
  region: string;
  population: number;
  demographics: {
    malePercentage: number;
    femalePercentage: number;
  };
  realEstate: {
    medianPricePerM2: number;
    averagePurchasePrice: number;
  };
  medical: {
    doctorsCount: number;
    medicalCentersCount: number;
    pharmaciesCount: number;
  };
  crime: {
    totalCrimesPerThousand: number;
    crimeBySeverity: {
      minor: number;
      moderate: number;
      severe: number;
    };
  };
  income: {
    medianIncome: number;
  };
  comparisons: {
    department: {
      realEstate: number;
      crime: number;
      income: number;
    };
    national: {
      realEstate: number;
      crime: number;
      income: number;
    };
  };
}

// Mock data for demonstration
const mockCommunes: CommuneData[] = [
  {
    id: "paris-75001",
    name: "Paris 1er",
    postalCode: "75001",
    department: "Paris",
    region: "Île-de-France",
    population: 16600,
    demographics: {
      malePercentage: 46.2,
      femalePercentage: 53.8,
    },
    realEstate: {
      medianPricePerM2: 15200,
      averagePurchasePrice: 1520000,
    },
    medical: {
      doctorsCount: 45,
      medicalCentersCount: 8,
      pharmaciesCount: 12,
    },
    crime: {
      totalCrimesPerThousand: 89.3,
      crimeBySeverity: {
        minor: 65.2,
        moderate: 18.7,
        severe: 5.4,
      },
    },
    income: {
      medianIncome: 54200,
    },
    comparisons: {
      department: {
        realEstate: 112,
        crime: 145,
        income: 138,
      },
      national: {
        realEstate: 185,
        crime: 178,
        income: 167,
      },
    },
  },
  {
    id: "lyon-69001",
    name: "Lyon 1er",
    postalCode: "69001",
    department: "Rhône",
    region: "Auvergne-Rhône-Alpes",
    population: 29800,
    demographics: {
      malePercentage: 48.1,
      femalePercentage: 51.9,
    },
    realEstate: {
      medianPricePerM2: 6850,
      averagePurchasePrice: 485000,
    },
    medical: {
      doctorsCount: 38,
      medicalCentersCount: 6,
      pharmaciesCount: 9,
    },
    crime: {
      totalCrimesPerThousand: 52.7,
      crimeBySeverity: {
        minor: 38.4,
        moderate: 11.2,
        severe: 3.1,
      },
    },
    income: {
      medianIncome: 38700,
    },
    comparisons: {
      department: {
        realEstate: 108,
        crime: 105,
        income: 119,
      },
      national: {
        realEstate: 132,
        crime: 105,
        income: 119,
      },
    },
  },
  {
    id: "marseille-13001",
    name: "Marseille 1er",
    postalCode: "13001",
    department: "Bouches-du-Rhône",
    region: "Provence-Alpes-Côte d'Azur",
    population: 38200,
    demographics: {
      malePercentage: 49.3,
      femalePercentage: 50.7,
    },
    realEstate: {
      medianPricePerM2: 4200,
      averagePurchasePrice: 315000,
    },
    medical: {
      doctorsCount: 28,
      medicalCentersCount: 4,
      pharmaciesCount: 7,
    },
    crime: {
      totalCrimesPerThousand: 67.2,
      crimeBySeverity: {
        minor: 48.1,
        moderate: 14.8,
        severe: 4.3,
      },
    },
    income: {
      medianIncome: 28900,
    },
    comparisons: {
      department: {
        realEstate: 95,
        crime: 118,
        income: 87,
      },
      national: {
        realEstate: 81,
        crime: 134,
        income: 89,
      },
    },
  },
];

export const searchCommunes = (query: string): CommuneData[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockCommunes.filter(
    (commune) =>
      commune.name.toLowerCase().includes(lowerQuery) ||
      commune.postalCode.includes(query) ||
      commune.department.toLowerCase().includes(lowerQuery)
  );
};

export const getCommuneById = (id: string): CommuneData | undefined => {
  return mockCommunes.find((commune) => commune.id === id);
};

export const getAllCommunes = (): CommuneData[] => {
  return mockCommunes;
};

