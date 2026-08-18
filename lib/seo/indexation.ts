import { isIndexingEnabled } from "@/config/env";
import type { Metadata } from "next";

export function shouldIndexPublicPage(entityIndexable = true): boolean {
  return isIndexingEnabled() && entityIndexable;
}

export function buildRobots(indexable: boolean): Metadata["robots"] {
  if (!shouldIndexPublicPage(indexable)) {
    return {
      index: false,
      follow: indexable,
      nocache: true,
      googleBot: {
        index: false,
        follow: indexable,
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
