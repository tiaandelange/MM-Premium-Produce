export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 text-page-title">{title}</h1>
      {description ? <p className="mt-4 text-lg text-muted">{description}</p> : null}
    </header>
  );
}
