export default function Card({ children, className = '' }) {
  return (
    <section className={`rounded border border-brand-border bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}
