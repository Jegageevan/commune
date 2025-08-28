'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import VisualiserHeader from '@/components/visualiser/VisualiserHeader';
import StatsSection from '@/components/visualiser/StatsSection';
import ChartsSection from '@/components/visualiser/ChartsSection';
import { CommuneData } from '@/components/visualiser/types';

export default function VisualiserCommune({
  params,
}: {
  params: Promise<{ codgeo: string }>;
}) {
  const { codgeo } = use(params);
  const code = decodeURIComponent(codgeo);
  const [rows, setRows] = useState<CommuneData[]>([]);

  // Chargement du CSV au montage
  useEffect(() => {
    Papa.parse('/fusion.csv', {
      download: true,
      header: true,
      // Conserver CODGEO comme chaîne pour garder les zéros initiaux
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (res) => {
        const data: CommuneData[] = (res.data as any[]).map((r) => ({
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
        <VisualiserHeader code={code} />
        <StatsSection row={row} />
        <ChartsSection
          genderData={genderData}
          birthDeathData={birthDeathData}
          employmentData={employmentData}
        />
      </div>
    </main>
  );
}
function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
