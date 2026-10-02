export default function Tag({
  hot,
  onClick,
  children,
}: {
  hot?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const className = hot ? "tag tag-hot" : "tag";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
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
