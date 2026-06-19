import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { routing } from "./routing";
import { LOCALE_COOKIE } from "./constants";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  let locale = requested;

  if (!locale || !hasLocale(routing.locales, locale)) {
    const store = await cookies();
    const cookieLocale = store.get(LOCALE_COOKIE)?.value;
    locale =
      cookieLocale && hasLocale(routing.locales, cookieLocale)
        ? cookieLocale
        : routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
