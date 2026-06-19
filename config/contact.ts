/** Public contact phone shown on the landing page CTA. */
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+998 99 801 93 53";

export function contactPhoneHref(phone = CONTACT_PHONE): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
