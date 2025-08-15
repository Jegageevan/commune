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

export default function CommuneNeo({ params }: { params: { codgeo: string } }) {
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
      <main className="min-h-screen bg-gradient-to-br from-[#0a223f] via-[#0c2f6a] to-[#0b6b66] text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <TopNav />
          <div className="mt-10 rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 backdrop-blur">
            Chargement des données pour <strong>{code}</strong>…
          </div>
        </div>
      </main>
    );
  }

  const pop = row.P22_POP || 0;
  const area = row.SUPERF || 0;
  const lastUpdate = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());
  const ph = row.P22_POPH || 0;
  const pf = row.P22_POPF || 0;
  const partF = pop ? (pf / pop) * 100 : 0;
  const partH = pop ? (ph / pop) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a223f] via-[#0c2f6a] to-[#0b6b66] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <TopNav />

        {/* HERO */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
          <div className="relative">
            <h1 className="text-5xl font-semibold tracking-tight drop-shadow-sm">
              Commune <span className="opacity-80">({code})</span>
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <Pill>{fmtPop(pop)} hab.</Pill>
              <Pill>{fmtArea(area)}</Pill>
              <Pill className="bg-white/10">Dernière mise à jour • {lastUpdate}</Pill>
            </div>

            <div className="mt-6">
              <button className="rounded-xl bg-teal-500/90 px-5 py-2.5 text-white shadow-lg hover:brightness-110 active:scale-[0.99]">
                Comparer cette commune
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 backdrop-blur">
            <FranceShapeGradient />
          </div>
        </section>

        {/* GRID CARDS */}
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard title="Revenu médian">
            <BigStat value={row.MED21 ? `${fmtNumber(row.MED21)} €` : '—'} />
            <SmallMuted>vs dép. & vs fr. — (placeholder)</SmallMuted>
          </GlassCard>

          <GlassCard title="Naissances & Décès 2023">
            <div className="grid grid-cols-2 gap-4">
              <MiniBars label="Naissances" values={sparkFrom(row.NAIS23)} accent="#22d3ee" />
              <MiniBars label="Décès" values={sparkFrom(row.DECES23)} accent="#f59e0b" />
            </div>
          </GlassCard>

          <GlassCard title="Logement">
            <BigStat value={`${fmtNumber(row.P22_LOGVAC)} vacants`} />
            <SmallMuted>sur {fmtNumber(row.P22_LOG)} logements</SmallMuted>
          </GlassCard>

          <GlassCard title="Répartition H/F">
            <div className="flex items-center gap-6">
              <DonutHF female={partF} male={partH} />
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Dot c="#60a5fa" /> Hommes <span className="font-semibold">{fmtNumber(partH)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dot c="#2dd4bf" /> Femmes <span className="font-semibold">{fmtNumber(partF)}%</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Emploi 15–64 ans">
            <div className="grid grid-cols-2 gap-4">
              <SmallBlock label="Actifs" value={fmtNumber(row.P22_ACT1564)} />
              <SmallBlock label="Chômeurs" value={fmtNumber(row.P22_CHOM1564)} />
            </div>
          </GlassCard>

          <GlassCard title="Cat. socio-éco (32)">
            <BigStat value={fmtNumber(row.C22_POP15P_STAT_GSEC32)} />
            <SmallMuted>Population 15+ — code 32</SmallMuted>
          </GlassCard>

          <GlassCard title="Évolution 5 ans" className="md:col-span-2">
            <Sparkline values={makeSmoothSeries(pop)} />
          </GlassCard>

          <AdTall />
        </section>

        <footer className="mt-10 flex items-center justify-between opacity-80 text-sm">
          <div>© CommuneData — données locales (CSV)</div>
          <Link className="underline" href="/">Retour au tableau</Link>
        </footer>
      </div>
    </main>
  );
}

/* ---------------- components ---------------- */

function TopNav() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">📍</span>
        <span className="text-lg font-semibold">CommuneData</span>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <span className="opacity-80">Données</span>
        <span className="opacity-80">Comparer</span>
        <span className="opacity-80">À propos</span>
      </div>
    </nav>
  );
}

function Pill({ children, className = '' }: { children: any; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-xl bg-white/5 px-3 py-1.5 text-sm ring-1 ring-white/10 ${className}`}>
      {children}
    </span>
  );
}

function GlassCard({ title, children, className = '' }: { title: string; children: any; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 shadow-lg backdrop-blur ${className}`}>
      <div className="text-[15px] opacity-80">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BigStat({ value }: { value: string }) {
  return <div className="text-3xl font-semibold text-[#52E3E1] drop-shadow">{value}</div>;
}
function SmallMuted({ children }: { children: any }) {
  return <div className="mt-1 text-xs opacity-70">{children}</div>;
}
function SmallBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-xl font-semibold text-[#52E3E1]">{value}</div>
    </div>
  );
}
function Dot({ c }: { c: string }) {
  return <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c }} />;
}

function FranceShapeGradient() {
  return (
    <svg viewBox="0 0 100 100" className="h-56 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#52E3E1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path
        d="M62 9l5 6 7-1 5 6-5 7 4 5-2 7 3 6-4 6-1 6-6 4-1 6-8 2-5 6-9-1-8-6-9 1-6-6-7-1-1-7 4-6-2-6 6-5-1-8 6-3 6-5 8 2 7-4 7 2z"
        fill="url(#g)"
        opacity={0.9}
      />
    </svg>
  );
}

function DonutHF({ female, male }: { female: number; male: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const femaleLen = (female / 100) * c;
  const maleLen = (male / 100) * c;

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="14" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="#60a5fa" strokeWidth="14"
        strokeDasharray={`${maleLen} ${c - maleLen}`} transform="rotate(-90 60 60)" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="#2dd4bf" strokeWidth="14"
        strokeDasharray={`${femaleLen} ${c - femaleLen}`} transform="rotate(${(male / 100) * 360 - 90} 60 60)" />
      <text x="60" y="64" textAnchor="middle" className="fill-white/90 text-sm">{Math.round(female)}% / {Math.round(male)}%</text>
    </svg>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const norm = values.map((v) => (max - min ? (v - min) / (max - min) : 0.5));
  const pts = norm.map((v, i) => `${(i / (norm.length - 1)) * 100},${100 - v * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-full">
      <polyline points={pts} fill="none" stroke="#52E3E1" strokeWidth="2.5" />
    </svg>
  );
}

function MiniBars({ label, values, accent = '#52E3E1' }: { label: string; values: number[]; accent?: string }) {
  const norm = values.map((v) => Math.max(0.12, Math.min(1, v / Math.max(...values, 1))));
  return (
    <div>
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <div className="flex items-end gap-1.5 h-12">
        {norm.map((n, i) => (
          <div key={i} className="w-4 rounded-t" style={{ height: `${n * 100}%`, background: `linear-gradient(180deg, ${accent}, rgba(82,227,225,0.2))` }} />
        ))}
      </div>
    </div>
  );
}

function AdTall() {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 shadow-lg backdrop-blur">
      <div className="rounded-xl bg-[#F3C76A] text-[#1f2937] p-8 text-center">
        <div className="opacity-80">Annonce</div>
        <div className="mt-2 text-3xl font-semibold">300×600</div>
      </div>
    </div>
  );
}

/* ---------------- utils ---------------- */

function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR') : '—';
}
function fmtPop(n: number) {
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M`;
  if (n >= 1_000) return `${(n / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} k`;
  return n.toLocaleString('fr-FR');
}
function fmtArea(n: number) {
  if (!Number.isFinite(n)) return '—';
  const rounded = Math.round(n);
  return `${rounded.toLocaleString('fr-FR')} km²`;
}
function makeSmoothSeries(anchor: number) {
  const base = Math.max(1, Math.log10(Math.max(1, anchor)));
  const xs = [0.98, 1.0, 1.02, 1.01, 1.04, 1.06, 1.07, 1.09];
  return xs.map((x) => x * base);
}
function sparkFrom(v: number) {
  const base = Math.max(1, v || 1);
  return [0.7, 0.9, 1.1, 1.05, 1.2].map((x) => x * base);
}
