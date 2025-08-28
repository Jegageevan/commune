import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function GenderChart({ data }: { data: ChartEntry[] }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Répartition H/F</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell key={`g-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GenderChart;
