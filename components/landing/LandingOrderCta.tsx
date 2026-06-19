import { TelegramLogoIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { getLocale } from "next-intl/server";
import { contactPhoneHref } from "@/config/contact";
import { getTelegramContactUrl } from "@/config/telegram";
import type { Locale } from "@/config/locales";
import {
  getLocaleLandingTexts,
  getSiteSettings,
} from "@/lib/server/site-settings";

export async function LandingOrderCta() {
  const locale = (await getLocale()) as Locale;
  const settings = await getSiteSettings();
  const copy = getLocaleLandingTexts(settings, locale);
  const telegramUrl = getTelegramContactUrl(
    locale,
    settings.telegramUsername,
  );

  return (
    <section
      id="order"
      style={{
        paddingBlock: "clamp(3rem, 8vw, 4.5rem)",
        paddingInline: "clamp(1rem, 4vw, 2rem)",
        background: "var(--color-bg-subtle)",
      }}
    >
      <div style={{ maxWidth: "56rem", marginInline: "auto" }}>
        <div className="landing-order-cta">
          <div className="landing-order-cta-glow" aria-hidden />
          <h2 className="landing-order-cta-title">{copy.orderCtaTitle}</h2>
          <p className="landing-order-cta-text">{copy.orderCtaSubtitle}</p>
          <div className="landing-order-cta-actions">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-order-cta-btn landing-order-cta-btn--telegram"
            >
              <TelegramLogoIcon weight="fill" size={20} />
              {copy.orderCtaTelegram}
            </a>
            <a
              href={contactPhoneHref(settings.contactPhone)}
              className="landing-order-cta-btn landing-order-cta-btn--phone"
            >
              <PhoneIcon weight="duotone" size={20} />
              {settings.contactPhone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
