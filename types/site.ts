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

export type DeliveryScope = "gauteng" | "nationwide";

export type DeliveryPolicy = {
  coverage: string;
  method: string;
  timeframe: string;
  feeZar: number;
  freeDeliveryThresholdZar: number | null;
  exclusions: string;
  maxDistanceKm: number | null;
};

export type PaymentPolicy = {
  /** Methods accepted for new orders right now. */
  currentMethods: Array<"eft">;
  /** Card/online checkout remains intentionally unconfigured until approved. */
  onlineCardStatus: "planned" | "unavailable" | "live";
  note: string;
};

export type ReturnsPolicy = {
  cancellationWindowHours: number;
  damagedOrIncorrect: string;
  wrongOrderRemedy: string;
  nonReturnable: string;
};

export type SiteConfig = {
  businessName: string;
  legalName: ConfigurableField<string>;
  tradingName: ConfigurableField<string>;
  founders: ConfigurableField<string>;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  country: ConfigurableField<string>;
  currency: ConfigurableField<string>;
  email: ConfigurableField<string>;
  phone: ConfigurableField<string>;
  whatsapp: ConfigurableField<string>;
  /** When false, never publish a street address even if one exists privately. */
  publishPublicAddress: boolean;
  address: ConfigurableField<SiteAddress>;
  supportHours: ConfigurableField<string>;
  deliveryScope: ConfigurableField<DeliveryScope>;
  deliveryPolicy: ConfigurableField<DeliveryPolicy>;
  deliveryAreas: ConfigurableField<string[]>;
  paymentPolicy: ConfigurableField<PaymentPolicy>;
  returnsPolicy: ConfigurableField<ReturnsPolicy>;
  socialProfiles: ConfigurableField<string[]>;
  logoPath: string;
  defaultOgImagePath: string;
};
