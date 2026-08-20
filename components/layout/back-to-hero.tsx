"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BackToHeroIcon } from "@/components/layout/icons";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";

export function BackToHero({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const messages = getMessages(locale);
  const [visible, setVisible] = useState(false);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting);
        },
        { threshold: 0.12 },
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }

    const onScroll = () => {
      setVisible(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <a
      href={isHome ? "#hero" : "#main"}
      className={visible ? "back-to-hero is-visible" : "back-to-hero"}
      aria-label={messages.backToHero}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <BackToHeroIcon />
    </a>
  );
}
