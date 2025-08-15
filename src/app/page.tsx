'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

/* ---------- Types ---------- */
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

/* ========================================================== */
/*                          PAGE                              */
/* ========================================================== */
export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<Row[]>([]);
  const [q, setQ] = useState('');   // recherche principale (CODGEO)
  const [c1, setC1] = useState(''); // comparer commune 1
  const [c2, setC2] = useState(''); // comparer commune 2
  const [focusBox, setFocusBox] = useState<'search' | 'c1' | 'c2' | null>(null);

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

  const suggestions = useMemo(() => {
    const term =
      (focusBox === 'search' ? q : focusBox === 'c1' ? c1 : focusBox === 'c2' ? c2 : '')
        .toLowerCase();
    if (!term) return [];
    return data.filter((r) => r.CODGEO.toLowerCase().includes(term)).slice(0, 8);
  }, [data, q, c1, c2, focusBox]);

  const trends = useMemo(() => {
    // “Top tendances” approximé : (naissances - décès) / population
    const scored = data
      .map((r) => ({
        row: r,
        score:
          Number.isFinite(r.P22_POP) && r.P22_POP > 0
            ? (((r.NAIS23 || 0) - (r.DECES23 || 0)) / r.P22_POP) * 100
            : -Infinity,
      }))
      .filter((x) => Number.isFinite(x.score));
    scored.sort((a, b) => (b.score as number) - (a.score as number));
    return scored.slice(0, 6).map((x) => x.row);
  }, [data]);

  function goExplore() {
    const code = q.trim();
    if (!code || !data.find((r) => r.CODGEO === code)) return;
    router.push(`/commune/${encodeURIComponent(code)}/v2`);
  }
  function goCompare() {
    if (!c1 || !c2) return;
    router.push(`/commune/${encodeURIComponent(c1)}/v2?compare=${encodeURIComponent(c2)}`);
  }

  return (
    <main className="min-h-screen text-white bg-gradient-to-br from-[#0AAE8A] via-[#0e3c70] to-[#0b2766]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        {/* NAV */}
        <nav className="flex items-center justify-between rounded-2xl bg-[#0c2a55]/60 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">📍</span>
            <span className="text-lg font-semibold">CommuneData</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="opacity-90">Données</span>
            <span className="opacity-90">Comparer</span>
            <span className="opacity-90">À propos</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">☰</span>
          </div>
        </nav>

        {/* HERO CONTAINER */}
        <section className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr,0.75fr]">
          {/* LEFT: Title + Search + Compare */}
          <div className="rounded-[28px] bg-gradient-to-br from-[#0b3164] via-[#0b2b56] to-[#0d2550] p-7 ring-1 ring-white/10 shadow-xl backdrop-blur-md">
            <h1 className="text-[44px] leading-[1.05] font-semibold tracking-tight">
              Découvrez<br /> votre commune
            </h1>

            {/* Search bar */}
            <div className="mt-6 flex items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocusBox('search')}
                  onBlur={() => setTimeout(() => setFocusBox(null), 150)}
                  placeholder="Rechercher une commune (CODGEO)"
                  className="w-full rounded-2xl bg-white/10 px-4 py-3 pr-3 text-white placeholder-white/60 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#6D5EF3]"
                />
                {focusBox === 'search' && suggestions.length > 0 && (
                  <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-[#0e2a51] ring-1 ring-white/10">
                    {suggestions.map((s) => (
                      <li
                        key={s.CODGEO}
                        className="cursor-pointer px-4 py-2 hover:bg-white/5"
                        onMouseDown={() => setQ(s.CODGEO)}
                      >
                        {s.CODGEO} <span className="opacity-60">• {fmtPop(s.P22_POP)} hab.</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={goExplore}
                className="rounded-2xl bg-gradient-to-r from-[#6D5EF3] to-[#F59E0B] px-5 py-3 font-medium text-white shadow-lg hover:brightness-110"
              >
                Explorer
              </button>
            </div>

            {/* city chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {exampleCodes(data).map((code) => (
                <button
                  key={code}
                  onClick={() => setQ(code)}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/10 hover:bg-white/15"
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Compare panel */}
            <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 md:grid-cols-[1fr,1fr,auto]">
              <InputSuggest
                value={c1}
                setValue={setC1}
                label="Commune 1"
                data={data}
                onFocus={() => setFocusBox('c1')}
                onBlur={() => setTimeout(() => setFocusBox(null), 150)}
                open={focusBox === 'c1'}
              />
              <InputSuggest
                value={c2}
                setValue={setC2}
                label="Commune 2"
                data={data}
                onFocus={() => setFocusBox('c2')}
                onBlur={() => setTimeout(() => setFocusBox(null), 150)}
                open={focusBox === 'c2'}
              />
              <button
                onClick={goCompare}
                disabled={!c1 || !c2}
                className="h-12 rounded-xl bg-[#5B8F64] px-5 font-medium text-white shadow disabled:opacity-50"
              >
                Comparer
              </button>
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className="rounded-[28px] bg-gradient-to-br from-[#0b3164] via-[#0b2b56] to-[#0d2550] p-7 ring-1 ring-white/10 shadow-xl backdrop-blur-md">
            <FranceMapLarge />
          </div>
        </section>

        {/* TOP TRENDS */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Top tendances</h2>
            <span className="text-sm opacity-80">Annonce</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trends.map((r) => (
              <TrendCard key={r.CODGEO} row={r} />
            ))}
          </div>
        </section>

        {/* SOURCES */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SourceCard icon="📈" label="INSEE" />
          <SourceCard icon="🛂" label="Ministère de l’intérieur" />
          <SourceCard icon="🏥" label="Santé" />
        </section>

        {/* TRUST + METRICS */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-2xl bg-[#F3C76A] p-6 text-[#1f2937] shadow">
            <h3 className="text-2xl font-semibold">Pourquoi nous faire confiance</h3>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Données issues de fichiers publics (CSV local).</li>
              <li>Mise en forme claire : cartes, tendances, comparaison.</li>
              <li>Respect de la vie privée : aucun envoi serveur des saisies.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="text-sm opacity-80">Disponibilité</div>
            <Progress value={92} />
            <div className="mt-4 text-sm opacity-80">Couverture des indicateurs</div>
            <Progress value={78} accent="#52E3E1" />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 flex items-center justify-between opacity-80 text-sm">
          <div>© CommuneData</div>
          <a className="underline" href="/fusion.csv" download>Télécharger CSV</a>
        </footer>
      </div>
    </main>
  );
}

/* ================= Components ================= */

function InputSuggest({
  value,
  setValue,
  label,
  data,
  onFocus,
  onBlur,
  open,
}: {
  value: string;
  setValue: (s: string) => void;
  label: string;
  data: Row[];
  onFocus: () => void;
  onBlur: () => void;
  open: boolean;
}) {
  const list = useMemo(() => {
    const term = value.toLowerCase();
    if (!term) return [];
    return data.filter((r) => r.CODGEO.toLowerCase().includes(term)).slice(0, 6);
  }, [data, value]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={label}
        className="h-12 w-full rounded-xl bg-white/10 px-4 text-white placeholder-white/70 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#5EEAD4]"
      />
      {open && list.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-[#0e2a51] ring-1 ring-white/10">
          {list.map((s) => (
            <li
              key={s.CODGEO}
              className="cursor-pointer px-4 py-2 hover:bg-white/5"
              onMouseDown={() => setValue(s.CODGEO)}
            >
              {s.CODGEO} <span className="opacity-60">• {fmtPop(s.P22_POP)} hab.</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TrendCard({ row }: { row: Row }) {
  const growth =
    Number.isFinite(row.P22_POP) && row.P22_POP > 0
      ? (((row.NAIS23 || 0) - (row.DECES23 || 0)) / row.P22_POP) * 100
      : 0;
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur shadow-lg">
      <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2dd4bf] to-[#3b82f6]" />
        <span className="absolute left-2 top-2 rounded-md bg-black/30 px-2 py-1 text-xs">Annonce</span>
      </div>
      <div className="text-lg font-semibold">{row.CODGEO}</div>
      <div className={`mt-1 text-sm ${growth >= 0 ? 'text-teal-300' : 'text-orange-300'}`}>
        {growth >= 0 ? '▲' : '▼'} {fmtNumber(Math.abs(growth))} %
      </div>
      <div className="mt-2 text-xs opacity-80">
        Pop : {fmtPop(row.P22_POP)} • Surf : {fmtArea(row.SUPERF)}
      </div>
    </div>
  );
}

function SourceCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">{icon}</span>
        <span className="text-lg font-medium">{label}</span>
      </div>
    </div>
  );
}

function FranceMapLarge() {
  return (
    <svg viewBox="0 0 100 100" className="h-72 w-full">
      <defs>
        <linearGradient id="mapg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#52E3E1" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path
        d="M62 9l5 6 7-1 5 6-5 7 4 5-2 7 3 6-4 6-1 6-6 4-1 6-8 2-5 6-9-1-8-6-9 1-6-6-7-1-1-7 4-6-2-6 6-5-1-8 6-3 6-5 8 2 7-4 7 2z"
        fill="url(#mapg)"
        opacity={0.9}
      />
      {/* Corse */}
      <circle cx="86" cy="88" r="4" fill="url(#mapg)" opacity={0.9} />
    </svg>
  );
}

function Progress({ value, accent = '#3B82F6' }: { value: number; accent?: string }) {
  return (
    <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${accent}, rgba(59,130,246,0.2))`,
        }}
      />
    </div>
  );
}

/* ================= Utils ================= */

function toNum(v: any): number {
  if (v == null || v === '') return NaN as unknown as number;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? (NaN as unknown as number) : n;
}
function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR', { maximumFractionDigits: 3 }) : '—';
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
function exampleCodes(rows: Row[]) {
  const sample = rows.slice(0, 3).map((r) => r.CODGEO);
  return sample.length ? sample : ['01001', '01002', '01004'];
}
