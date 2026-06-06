export default function Card({ children, className = '', ...props }) {
  return (
    <section
      className={`rounded-lg border border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(16,32,51,0.08)] ring-1 ring-slate-900/5 backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
