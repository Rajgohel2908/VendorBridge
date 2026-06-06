export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-white/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-brand-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-brand-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
