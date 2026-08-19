import { availabilityLabel } from "@/lib/utils/format";
import type { AppLocale } from "@/lib/i18n/config";
import type { AvailabilityStatus } from "@/types/catalog";

export function AvailabilityDisplay({
  status,
  locale = "en",
}: {
  status: AvailabilityStatus;
  locale?: AppLocale;
}) {
  return <p className="text-sm text-muted">{availabilityLabel(status, locale)}</p>;
}
