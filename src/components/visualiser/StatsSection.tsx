import StatCard from './StatCard';
import { CommuneData } from './types';

export function StatsSection({ row }: { row: CommuneData }) {
  return (
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
  );
}

function fmtInt(n?: number) {
  return Number.isFinite(n) ? Math.round(n!).toLocaleString('fr-FR') : '—';
}

function fmtNumber(n?: number) {
  return Number.isFinite(n) ? Number(n!).toLocaleString('fr-FR') : '—';
}

export default StatsSection;
