export default function Spinner({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm opacity-70 animate-fade-in">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
