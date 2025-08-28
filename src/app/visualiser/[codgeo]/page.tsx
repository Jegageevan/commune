'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Définition du type de ligne pour fusion.csv
interface Row {
  CODGEO: string;
  P22_POP: number;
  SUPERF: number;
  NAIS23: number;
  DECES23: number;
  P22_LOG: number;
  P22_LOGVAC: number;
  MED21: number;
  P22_CHOM1564: number;
  P22_ACT1564: number;
  P22_POPH: number;
  P22_POPF: number;
}

export default function VisualiserCommune({ params }: { params: Promise<{ codgeo: string }> }) {
  const { codgeo } = use(params);
  const code = decodeURIComponent(codgeo);
  const [rows, setRows] = useState<Row[]>([]);

  // Chargement du CSV au montage
  useEffect(() => {
    Papa.parse('/fusion.csv', {
      download: true,
      header: true,
      // Conserver CODGEO comme chaîne pour garder les zéros initiaux
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (res) => {
        const data: Row[] = (res.data as any[]).map((r) => ({
          CODGEO: String(r.CODGEO ?? '').trim().padStart(5, '0'),
          P22_POP: toNum(r.P22_POP),
          SUPERF: toNum(r.SUPERF),
          NAIS23: toNum(r.NAIS23),
          DECES23: toNum(r.DECES23),
          P22_LOG: toNum(r.P22_LOG),
          P22_LOGVAC: toNum(r.P22_LOGVAC),
          MED21: toNum(r.MED21),
          P22_CHOM1564: toNum(r.P22_CHOM1564),
          P22_ACT1564: toNum(r.P22_ACT1564),
          P22_POPH: toNum(r.P22_POPH),
          P22_POPF: toNum(r.P22_POPF),
        }));
        setRows(data);
      },
    });
  }, []);

  const row = useMemo(() => {
    const codeNorm = String(code ?? '').trim().padStart(5, '0');
    return rows.find((r) => r.CODGEO === codeNorm);
  }, [rows, code]);

  if (!row) {
    return (
      <main className="min-h-screen p-6 bg-gray-50 text-gray-900">
        <p>Chargement des données pour <strong>{code}</strong>…</p>
      </main>
    );
  }

  const genderData = [
    { name: 'Hommes', value: row.P22_POPH, color: '#0284c7' },
    { name: 'Femmes', value: row.P22_POPF, color: '#0ea5e9' },
  ];

  const birthDeathData = [
    { name: 'Naissances', value: row.NAIS23, color: '#16a34a' },
    { name: 'Décès', value: row.DECES23, color: '#b91c1c' },
  ];

  const employmentData = [
    { name: 'Actifs', value: row.P22_ACT1564, color: '#0d9488' },
    { name: 'Chômeurs', value: row.P22_CHOM1564, color: '#f59e0b' },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-semibold">
            Commune <span className="text-gray-500">({code})</span>
          </h1>
          <Link
            href="/"
            className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Comparer cette commune
          </Link>
        </header>

        {/* Cartes de statistiques */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Population" value={`${fmtInt(row.P22_POP)} hab.`} />
          <StatCard title="Superficie" value={`${fmtNumber(row.SUPERF)} km²`} />
          <StatCard
            title="Logements"
            value={fmtInt(row.P22_LOG)}
            sub={`${fmtInt(row.P22_LOGVAC)} vacants`}
          />
          <StatCard title="Médecins" value={fmtInt(row.MED21)} />
        </section>

        {/* Graphiques */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Répartition H/F */}
          <div className="rounded-xl border p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Répartition H/F</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`g-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Naissances vs décès */}
          <div className="rounded-xl border p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-medium">Naissances / Décès 2023</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={birthDeathData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {birthDeathData.map((entry, index) => (
                      <Cell key={`bd-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emploi */}
          <div className="rounded-xl border p-4 shadow-sm md:col-span-2">
            <h2 className="mb-4 text-lg font-medium">Emploi 15–64 ans</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employmentData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {employmentData.map((entry, index) => (
                      <Cell key={`emp-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-600">{sub}</p>}
    </div>
  );
}

function fmtInt(n?: number) {
  return Number.isFinite(n) ? Math.round(n!).toLocaleString('fr-FR') : '—';
}
function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR') : '—';
}
function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
