import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { vendor: 'Acme', days: 12, wins: 4 },
  { vendor: 'Metro', days: 9, wins: 3 },
  { vendor: 'Prime', days: 16, wins: 2 },
];

export default function VendorPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="vendor" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="days" fill="#2563EB" />
        <Bar dataKey="wins" fill="#16A34A" />
      </BarChart>
    </ResponsiveContainer>
  );
}
