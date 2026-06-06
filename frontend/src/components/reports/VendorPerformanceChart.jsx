import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const fallbackData = [
  { vendor: 'Acme', days: 12, wins: 4 },
  { vendor: 'Metro', days: 9, wins: 3 },
  { vendor: 'Prime', days: 16, wins: 2 },
];

export default function VendorPerformanceChart({ data }) {
  const chartData = data?.length ? data : fallbackData;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <XAxis dataKey="vendor" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="days" fill="#2563EB" name="Avg Delivery Days" />
        <Bar dataKey="wins" fill="#16A34A" name="Orders Won" />
      </BarChart>
    </ResponsiveContainer>
  );
}
