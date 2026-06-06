import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Jan', spend: 12000 },
  { month: 'Feb', spend: 18000 },
  { month: 'Mar', spend: 15000 },
  { month: 'Apr', spend: 24000 },
];

export default function SpendingChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="spend" stroke="#2563EB" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
