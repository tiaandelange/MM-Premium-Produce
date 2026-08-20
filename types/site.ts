export type ConfirmationStatus = "todo" | "confirmed";

export type UnconfirmedField = {
  status: "todo";
  value: null;
  note: string;
};

export type ConfirmedField<T> = {
  status: "confirmed";
  value: T;
  note?: string;
};

export type ConfigurableField<T> = UnconfirmedField | ConfirmedField<T>;

export type SiteAddress = {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
};

export type SiteConfig = {
  businessName: string;
  legalName: ConfigurableField<string>;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  country: ConfigurableField<string>;
  currency: ConfigurableField<string>;
  email: ConfigurableField<string>;
  phone: ConfigurableField<string>;
  address: ConfigurableField<SiteAddress>;
  /** Confirmed service scope (nationwide), separate from unpublished zone/fee detail. */
  deliveryScope: ConfigurableField<"nationwide">;
  deliveryAreas: ConfigurableField<string[]>;
  socialProfiles: ConfigurableField<string[]>;
  logoPath: string;
  defaultOgImagePath: string;
};
