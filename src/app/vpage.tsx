'use client';

import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';

type Row = {
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
  C22_POP15P_STAT_GSEC32: number;
};

export default function Page() {
  const [data, setData] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof Row>('P22_POP');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    Papa.parse('/fusion.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows: Row[] = (res.data as any[]).map((r) => ({
          CODGEO: String(r.CODGEO ?? '').trim(),
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
          C22_POP15P_STAT_GSEC32: toNum(r.C22_POP15P_STAT_GSEC32),
        }));
        setData(rows);
      },
    });
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return data.filter(
      (r) =>
        r.CODGEO.toLowerCase().includes(term) ||
        String(r.P22_POP).includes(term)
    );
  }, [data, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return String(av).localeCompare(String(bv));
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const total = useMemo(
    () => ({
      communes: data.length,
      pop: sum(data.map((r) => r.P22_POP)),
      area: sum(data.map((r) => r.SUPERF)),
      naiss: sum(data.map((r) => r.NAIS23)),
      dec: sum(data.map((r) => r.DECES23)),
    }),
    [data]
  );

  function onSort(k: keyof Row) {
    if (k === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(k);
      setSortDir('desc');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">INSEE — Tableau communal</h1>
            <p className="text-sm text-gray-600">Source : fusion.csv</p>
          </div>
          <div className="flex gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher par CODGEO ou valeur…"
              className="h-10 rounded-xl border border-gray-300 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <a
              href="/fusion.csv"
              download
              className="h-10 inline-flex items-center rounded-xl border px-4 text-sm font-medium bg-white shadow-sm hover:bg-gray-50"
            >
              Télécharger CSV
            </a>
          </div>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi label="Communes" value={fmtInt(total.communes)} />
          <Kpi label="Population totale" value={fmtInt(total.pop)} />
          <Kpi label="Superficie totale" value={`${fmtNumber(total.area)} km²`} />
          <Kpi
            label="Naissances / Décès 2023"
            value={`${fmtInt(total.naiss)} / ${fmtInt(total.dec)}`}
          />
        </section>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {columns.map((c) => (
                    <Th
                      key={c.key as string}
                      onClick={() => onSort(c.key)}
                      active={sortKey === c.key}
                      dir={sortDir}
                    >
                      {c.label}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr
                    key={r.CODGEO + i}
                    className={i % 2 ? 'bg-white' : 'bg-gray-50/30'}
                  >
                    <Td>
                      <Link
                        href={`/commune/${encodeURIComponent(r.CODGEO)}`}
                        className="underline"
                      >
                        {r.CODGEO}
                      </Link>
                    </Td>
                    <Td className="text-right">{fmtInt(r.P22_POP)}</Td>
                    <Td className="text-right">{fmtNumber(r.SUPERF)}</Td>
                    <Td className="text-right">{fmtInt(r.NAIS23)}</Td>
                    <Td className="text-right">{fmtInt(r.DECES23)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_LOG)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_LOGVAC)}</Td>
                    <Td className="text-right">{fmtNumber(r.MED21)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_CHOM1564)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_ACT1564)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_POPH)}</Td>
                    <Td className="text-right">{fmtNumber(r.P22_POPF)}</Td>
                    <Td className="text-right">
                      {fmtNumber(r.C22_POP15P_STAT_GSEC32)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-gray-500">
          Fait avec Next.js & Tailwind. Données locales non persistées.
        </footer>
      </div>
    </main>
  );
}

/** Cards KPI */
function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

/** Table header cell with sort */
function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: any;
  onClick: () => void;
  active: boolean;
  dir: 'asc' | 'desc';
}) {
  return (
    <th
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-2 text-left font-medium cursor-pointer select-none ${
        active ? 'underline' : ''
      }`}
      title="Trier"
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {active && <span aria-hidden>{dir === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  );
}

/** ✅ Table data cell (fixe l'erreur “Td is not defined”) */
function Td({
  children,
  className = '',
}: {
  children: any;
  className?: string;
}) {
  return <td className={`px-3 py-2 border-b border-gray-200 ${className}`}>{children}</td>;
}

/* Utils */
function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
function sum(arr: number[]) {
  return arr.reduce((a, b) => a + (Number(b) || 0), 0);
}
function fmtInt(n?: number) {
  return Number.isFinite(n) ? Math.round(n!).toLocaleString('fr-FR') : '—';
}
function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR') : '—';
}

const columns: { key: keyof Row; label: string }[] = [
  { key: 'CODGEO', label: 'CODGEO' },
  { key: 'P22_POP', label: 'P22_POP' },
  { key: 'SUPERF', label: 'SUPERF (km²)' },
  { key: 'NAIS23', label: 'NAIS23' },
  { key: 'DECES23', label: 'DECES23' },
  { key: 'P22_LOG', label: 'P22_LOG' },
  { key: 'P22_LOGVAC', label: 'P22_LOGVAC' },
  { key: 'MED21', label: 'MED21 (€)' },
  { key: 'P22_CHOM1564', label: 'P22_CHOM1564' },
  { key: 'P22_ACT1564', label: 'P22_ACT1564' },
  { key: 'P22_POPH', label: 'P22_POPH' },
  { key: 'P22_POPF', label: 'P22_POPF' },
  { key: 'C22_POP15P_STAT_GSEC32', label: 'C22_POP15P_STAT_GSEC32' },
];
