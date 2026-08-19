import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function NewsletterSignup({ locale }: { locale: AppLocale }) {
  const messages = getMessages(locale);
  return (
    <section className="py-16">
      <div className="site-container max-w-2xl">
        <h2 className="text-section-title">{messages.emailUpdates}</h2>
        <p className="mt-3 text-muted">{messages.newsletterNote}</p>
        <fieldset disabled className="mt-6 border-0 p-0">
          <legend className="sr-only">{messages.emailUpdates}</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              {messages.emailAddress}
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              disabled
              placeholder={messages.emailAddress}
              autoComplete="email"
              className="field-control flex-1"
            />
            <span className="btn-disabled">{messages.signUpLater}</span>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
