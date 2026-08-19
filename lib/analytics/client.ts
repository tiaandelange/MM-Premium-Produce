"use client";

import {
  ANALYTICS_CONSENT_COOKIE,
  GA_MEASUREMENT_ID,
  isGaConfigured,
  type AnalyticsConsent,
  type AnalyticsEventName,
} from "@/lib/analytics/events";
import { stripPii } from "@/lib/analytics/items";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsentCookie(): AnalyticsConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ANALYTICS_CONSENT_COOKIE}=(granted|denied)`));
  return (match?.[1] as AnalyticsConsent | undefined) ?? null;
}

export function hasAnalyticsConsent(): boolean {
  return isGaConfigured() && readConsentCookie() === "granted";
}

function ensureGtag() {
  if (typeof window === "undefined" || !isGaConfigured()) return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

export function loadGoogleAnalytics() {
  if (typeof document === "undefined" || !isGaConfigured() || !hasAnalyticsConsent()) return;
  if (document.getElementById("ga4-gtag")) {
    ensureGtag();
    return;
  }
  ensureGtag();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    send_page_view: true,
  });
  const script = document.createElement("script");
  script.id = "ga4-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name: AnalyticsEventName, params: Record<string, unknown> = {}) {
  if (!hasAnalyticsConsent()) return;
  ensureGtag();
  window.gtag?.("event", name, stripPii(params));
}

export async function persistAnalyticsConsent(value: AnalyticsConsent) {
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  await fetch("/api/consent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ analytics: value }),
  });
  if (value === "granted") loadGoogleAnalytics();
}
