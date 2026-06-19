import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { BrandLogo } from "./BrandLogo";

export async function LandingHeader() {
  const t = await getTranslations("landing");
  const tc = await getTranslations("common");

  const links = [
    { href: "#how-it-works", label: t("navHow") },
    { href: "#features", label: t("navFeatures") },
    { href: "#templates", label: t("navCatalogue") },
    { href: "#order", label: t("navOrder") },
  ];

  return (
    <header className="landing-header-wrap">
      <div className="landing-header-pill">
        <Link href="/" className="landing-brand">
          <BrandLogo size={26} />
          <span className="landing-brand-name">{tc("brand")}</span>
        </Link>

        <nav className="landing-nav" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="landing-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-header-actions">
          <span className="landing-header-divider" aria-hidden />
          <LocaleSwitcher variant="landing" />
          <Link href="#order" className="landing-cta-btn">
            <SparkleIcon weight="fill" size={14} />
            <span className="landing-cta-label">{t("navOrder")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
