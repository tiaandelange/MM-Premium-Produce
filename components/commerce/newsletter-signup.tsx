import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * Public newsletter teaser. No form until a mailing service is connected.
 * Keep this component so a live signup form can replace the teaser later.
 */
export function NewsletterSignup({ locale }: { locale: AppLocale }) {
  const messages = getMessages(locale);
  return (
    <section className="home-newsletter home-newsletter-compact">
      <div className="site-container">
        <div className="home-newsletter-panel">
          <h2 className="text-section-title">{messages.freshUpdatesSoon}</h2>
          <p className="mt-3 max-w-2xl text-muted">{messages.freshUpdatesSoonBody}</p>
        </div>
      </div>
    </section>
  );
}
