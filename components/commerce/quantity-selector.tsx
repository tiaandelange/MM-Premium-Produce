"use client";

import { useFormStatus } from "react-dom";

export function QuantitySelector({
  name = "quantity",
  label,
  min = 1,
  max,
  defaultValue = 1,
}: {
  name?: string;
  label: string;
  min?: number;
  max: number;
  defaultValue?: number;
}) {
  const { pending } = useFormStatus();
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        type="number"
        name={name}
        min={min}
        max={Math.max(min, max)}
        defaultValue={defaultValue}
        disabled={pending}
        className="field-control w-24"
      />
    </label>
  );
}
