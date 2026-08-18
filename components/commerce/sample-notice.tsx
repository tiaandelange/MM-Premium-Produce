export function SampleNotice({ entityLabel }: { entityLabel: string }) {
  return (
    <p className="rounded-card border border-line bg-notice px-4 py-3 text-sm text-ink">
      This {entityLabel} is part of the development sample catalogue. Details, pricing
      and availability will be replaced with confirmed information before launch.
    </p>
  );
}
