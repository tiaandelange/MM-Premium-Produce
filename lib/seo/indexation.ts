import { isIndexingEnabled } from "@/config/env";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import type { Metadata } from "next";

export function shouldIndexPublicPage(entityIndexable = true): boolean {
  return isIndexingEnabled() && entityIndexable;
}

export function buildRobots(indexable: boolean, followWhenNoindex = false): Metadata["robots"] {
  if (!shouldIndexPublicPage(indexable)) {
    return {
      index: false,
      follow: indexable || followWhenNoindex,
      nocache: true,
      googleBot: {
        index: false,
        follow: indexable || followWhenNoindex,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export const adminRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export async function buildNotFoundMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  return {
    title: { absolute: messages.pageNotFound },
    description: messages.pageNotFoundDescription,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
