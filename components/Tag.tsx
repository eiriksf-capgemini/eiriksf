export default function Tag({ hot, children }: { hot?: boolean; children: React.ReactNode }) {
  return <span className={hot ? "tag tag-hot" : "tag"}>{children}</span>;
}

export function Tags({ items, hot = [] }: { items: readonly string[]; hot?: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <Tag key={t} hot={hot.includes(t)}>
          {t}
        </Tag>
      ))}
    </div>
  );
}
