/**
 * URL migrations. Once a public URL is indexed, add a redirect here
 * rather than silently changing the slug.
 */
export type RedirectRule = {
  from: string;
  to: string;
  permanent: boolean;
};

export const redirects: RedirectRule[] = [];
