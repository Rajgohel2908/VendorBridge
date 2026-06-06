export default function Stepper({ steps }) {
  return (
    <ol className="space-y-4">
      {steps.map((step) => (
        <li key={step.label} className="flex gap-3">
          <span className={`mt-1 h-3 w-3 rounded-full ${step.done ? 'bg-brand-primary' : 'bg-slate-300'}`} />
          <span className="text-sm">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
