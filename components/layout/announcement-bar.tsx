import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function AnnouncementBar({ locale }: { locale: AppLocale }) {
  const messages = getMessages(locale);
  return (
    <p className="bg-brand-fill px-4 py-2 text-center text-sm font-medium text-brand-on-fill">
      {messages.announcement}
    </p>
  );
}
