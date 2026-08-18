import { availabilityLabel } from "@/lib/utils/format";
import type { AvailabilityStatus } from "@/types/catalog";

export function AvailabilityDisplay({ status }: { status: AvailabilityStatus }) {
  return <p className="text-sm text-muted">{availabilityLabel(status)}</p>;
}
