export default function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded border border-brand-border bg-white">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-slate-50 text-left text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-brand-border px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
              {columns.map((column) => (
                <td key={column} className="border-b border-brand-border px-4 py-3">
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
