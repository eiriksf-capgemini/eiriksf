export default function Label({ idx, children }: { idx?: string; children: React.ReactNode }) {
  return (
    <div className="label">
      {idx && <span className="font-bold">{idx}</span>}
      {children}
    </div>
  );
}
