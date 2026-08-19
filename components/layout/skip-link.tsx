import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function SkipLink({ locale }: { locale: AppLocale }) {
  const messages = getMessages(locale);
  return (
    <a href="#main" className="skip-link">
      {messages.skipToContent}
    </a>
  );
}
