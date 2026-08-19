"use client";

import { useEffect, useState } from "react";
import { persistAnalyticsConsent, loadGoogleAnalytics } from "@/lib/analytics/client";
import { isGaConfigured } from "@/lib/analytics/events";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";

export function AnalyticsRoot({
  locale,
  consent,
}: {
  locale: AppLocale;
  consent: "granted" | "denied" | null;
}) {
  const messages = getMessages(locale);
  const [visible, setVisible] = useState(isGaConfigured() && consent === null);
  const configured = isGaConfigured();

  useEffect(() => {
    if (consent === "granted") loadGoogleAnalytics();
  }, [consent]);

  if (!configured) return null;

  return (
    <>
      {visible ? (
        <div className="consent-banner" role="dialog" aria-label={messages.cookieSettings}>
          <p>{messages.analyticsConsentBody}</p>
          <div className="consent-banner-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={async () => {
                await persistAnalyticsConsent("granted");
                setVisible(false);
              }}
            >
              {messages.acceptAnalytics}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                await persistAnalyticsConsent("denied");
                setVisible(false);
              }}
            >
              {messages.rejectAnalytics}
            </button>
          </div>
        </div>
      ) : null}
      <CookieSettingsButton
        locale={locale}
        onOpen={() => setVisible(true)}
        hidden={visible || !configured}
      />
    </>
  );
}

function CookieSettingsButton({
  locale,
  onOpen,
  hidden,
}: {
  locale: AppLocale;
  onOpen: () => void;
  hidden: boolean;
}) {
  const messages = getMessages(locale);
  if (hidden) return null;
  return (
    <button type="button" className="cookie-settings" onClick={onOpen}>
      {messages.cookieSettings}
    </button>
  );
}
