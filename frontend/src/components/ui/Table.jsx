export default function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(16,32,51,0.07)] ring-1 ring-slate-900/5">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-slate-100/90 text-left text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} className="border-b border-brand-border/70 transition hover:bg-blue-50/60">
              {columns.map((column) => (
                <td key={column} className="px-4 py-3">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
