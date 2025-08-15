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

export default function CommunePage({ params }: { params: { codgeo: string } }) {
  const code = decodeURIComponent(params.codgeo);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    Papa.parse('/fusion.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data: Row[] = (res.data as any[]).map((r) => ({
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
        setRows(data);
      },
    });
  }, []);

  const row = useMemo(() => rows.find((r) => r.CODGEO === code), [rows, code]);

  if (!row) {
    return (
      <main className="min-h-screen bg-[#FFF9EE] text-[#0F172A]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Header />
          <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">
            <p>Chargement des données pour <strong>{code}</strong>…</p>
            <p className="mt-2 text-sm text-gray-600">
              Assure-toi que <code>/public/fusion.csv</code> contient bien ce CODGEO.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const total = row.P22_POP || 0;
  const ph = row.P22_POPH || 0;
  const pf = row.P22_POPF || 0;
  const partF = total ? (pf / total) * 100 : 0;
  const partH = total ? (ph / total) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#FFF9EE] text-[#0F172A]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Nav />

        {/* HERO */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,280px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs text-gray-700 ring-1 ring-black/5">
                <span className="inline-block h-2 w-2 rounded-full bg-[#5B8F64]" />
                CommuneData
              </span>
              <span className="text-xs text-gray-500">|</span>
              <Link href="/" className="text-xs text-gray-600 hover:underline">Données</Link>
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Commune <span className="text-gray-500">({code})</span>
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{fmtInt(total)} hab.</Badge>
              <Badge className="bg-white/70 text-gray-700">Vs France</Badge>
              <Badge className="bg-white/70 text-gray-700">Mise à jour récente</Badge>
            </div>

            <div className="mt-5">
              <button className="rounded-xl bg-[#5B8F64] px-4 py-2 text-white shadow hover:brightness-95">
                Comparer cette commune
              </button>
            </div>
          </div>

          {/* France silhouette (placeholder) */}
          <div className="rounded-2xl bg-[#E7F0E7] p-6 ring-1 ring-black/5">
            <FranceShape />
          </div>
        </section>

        {/* GRID CARDS */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Revenu médian" value={row.MED21 ? `${fmtNumber(row.MED21)} €` : '—'} />
          <StatCard title="Logements vacants" value={fmtNumber(row.P22_LOGVAC)} subtitle={`sur ${fmtNumber(row.P22_LOG)} logements`} />
          <AdCard />

          <SplitCard title="Répartition H/F" leftLabel="H" rightLabel="F" left={partH} right={partF} />

          <StatCard title="Naissances 2023" value={fmtInt(row.NAIS23)} />
          <StatCard title="Décès 2023" value={fmtInt(row.DECES23)} />
          <StatCard title="Superficie" value={`${fmtNumber(row.SUPERF)} km²`} />
          <StatCard title="Actifs 15–64 ans" value={fmtNumber(row.P22_ACT1564)} />
          <StatCard title="Chômeurs 15–64 ans" value={fmtNumber(row.P22_CHOM1564)} />
          <StatCard title="Cat. socio-éco (32)" value={fmtNumber(row.C22_POP15P_STAT_GSEC32)} />

          <InfoCard title="Alert.commune" linkLabel="Découvrir" />
          <SourcesCard />
        </section>

        {/* Evolution (placeholder) */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Évolution 5 ans</h2>
          <div className="mt-3 rounded-2xl border bg-white p-4 shadow-sm">
            <Sparkline values={makeSmoothSeries(total)} />
          </div>
        </section>

        {/* Accordions (visuels) */}
        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Accordion title="Arrondissements">
            <p className="text-sm text-gray-600">Donnée non fournie dans le CSV actuel.</p>
          </Accordion>
          <Accordion title="Arrondissement" rightAction="Collapser">
            <p className="text-sm text-gray-600">Donnée non fournie dans le CSV actuel.</p>
          </Accordion>
        </section>

        <footer className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ShareCard />
        </footer>
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function Nav() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0E7] text-[#5B8F64] font-bold">📍</span>
        <span className="text-lg font-semibold">CommuneData</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-700">
        <Link href="/" className="hover:underline">Données</Link>
        <span className="cursor-not-allowed opacity-60">Comparer</span>
        <span className="cursor-not-allowed opacity-60">À propos</span>
      </div>
    </nav>
  );
}

function Badge({ children, className = '' }: { children: any; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-sm bg-white text-gray-900 ring-1 ring-black/5 ${className}`}>
      {children}
    </span>
  );
}

function FranceShape() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-40 fill-[#A5C5A8]">
      <path d="M62 9l5 6 7-1 5 6-5 7 4 5-2 7 3 6-4 6-1 6-6 4-1 6-8 2-5 6-9-1-8-6-9 1-6-6-7-1-1-7 4-6-2-6 6-5-1-8 6-3 6-5 8 2 7-4 7 2z" />
    </svg>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-[15px] text-gray-700">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
}

function AdCard() {
  return (
    <div className="rounded-2xl bg-white p-0 shadow-sm ring-1 ring-black/5">
      <div className="m-4 rounded-xl bg-[#FFE9B8] p-6 text-center text-gray-800">
        <div className="text-sm">Annonce</div>
        <div className="text-2xl font-semibold mt-1">300×600</div>
      </div>
    </div>
  );
}

function SplitCard({ title, leftLabel, rightLabel, left, right }: { title: string; leftLabel: string; rightLabel: string; left: number; right: number; }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const rightLen = (right / 100) * c;
  const leftLen = c - rightLen;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-[15px] text-gray-700">{title}</div>
      <div className="mt-3 flex items-center gap-4">
        <svg viewBox="0 0 80 80" className="h-24 w-24">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#E5E7EB" strokeWidth="12" />
          <circle
            cx="40" cy="40" r={r} fill="none" stroke="#5B8F64" strokeWidth="12"
            strokeDasharray={`${rightLen} ${leftLen}`} strokeDashoffset="0" transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-600">{leftLabel}</span>
            <span className="font-semibold">{fmtNumber(left)}%</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-600">{rightLabel}</span>
            <span className="font-semibold">{fmtNumber(right)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, linkLabel }: { title: string; linkLabel: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-[15px] text-gray-700">{title}</div>
      <div className="mt-2">
        <button className="inline-flex items-center gap-1 text-sm text-[#0F172A] hover:underline">
          {linkLabel} <span>›</span>
        </button>
      </div>
    </div>
  );
}

function SourcesCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-[15px] text-gray-700">Sources</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#DDEFD8]">📊</span>
          <span>INSEE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#DDEFD8]">🏥</span>
          <span>Santé</span>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const norm = values.map((v) => (max - min ? (v - min) / (max - min) : 0.5));
  const pts = norm.map((v, i) => `${(i / (norm.length - 1)) * 100},${100 - v * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-full">
      <polyline points={pts} fill="none" stroke="#5B8F64" strokeWidth="2" />
    </svg>
  );
}

function Accordion({ title, rightAction, children }: { title: string; rightAction?: string; children: any }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{title}</div>
        {rightAction && <button className="text-sm text-gray-600">{rightAction} ▾</button>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ShareCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-[15px] text-gray-700">Partager</div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-[#5B8F64] px-3 py-2 text-white">Copier le lien</button>
        <button className="rounded-lg border px-3 py-2">Exporter CSV</button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F0E7] text-[#5B8F64] font-bold">📍</span>
      <span className="text-lg font-semibold">CommuneData</span>
    </div>
  );
}

/* ---------- Utils ---------- */
function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
function fmtInt(n?: number) {
  return Number.isFinite(n) ? Math.round(n!).toLocaleString('fr-FR') : '—';
}
function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR') : '—';
}
function makeSmoothSeries(anchor: number) {
  const base = Math.max(1, Math.log10(Math.max(1, anchor)));
  const xs = [0.98, 1.0, 1.03, 1.02, 1.05, 1.06, 1.08];
  return xs.map((x) => x * base);
}
