/**
 * Star rating display component.
 * Shows 1–5 stars filled/empty based on the value.
 * If `onChange` is provided, stars become clickable for interactive rating.
 */
export default function StarRating({ value = 0, onChange, size = 'text-base' }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role={onChange ? 'button' : undefined}
          tabIndex={onChange ? 0 : undefined}
          onClick={() => onChange?.(i)}
          onKeyDown={(e) => e.key === 'Enter' && onChange?.(i)}
          className={`${onChange ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          style={{ color: i <= Math.round(value) ? '#f59e0b' : '#d1d5db' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
