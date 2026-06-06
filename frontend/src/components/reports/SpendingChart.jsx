import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const fallbackData = [
  { month: 'Jan', spend: 12000 },
  { month: 'Feb', spend: 18000 },
  { month: 'Mar', spend: 15000 },
  { month: 'Apr', spend: 24000 },
];

export default function SpendingChart({ data }) {
  const chartData = data?.length ? data : fallbackData;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
        <Line type="monotone" dataKey="spend" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
