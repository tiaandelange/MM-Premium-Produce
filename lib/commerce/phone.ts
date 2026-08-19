export function normalizeSaPhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

export function isValidSaPhone(value: string): boolean {
  const normalized = normalizeSaPhone(value);
  return /^(?:\+27|0)[1-9]\d{8}$/.test(normalized);
}
