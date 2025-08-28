import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

export function EmploymentChart({ data }: { data: ChartEntry[] }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm md:col-span-2">
      <h2 className="mb-4 text-lg font-medium">Emploi 15–64 ans</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`emp-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EmploymentChart;
