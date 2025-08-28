import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function BirthDeathChart({ data }: { data: ChartEntry[] }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Naissances / Décès 2023</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`bd-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BirthDeathChart;
