interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
}

export function StatCard({ title, value, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-600">{sub}</p>}
    </div>
  );
}

export default StatCard;
