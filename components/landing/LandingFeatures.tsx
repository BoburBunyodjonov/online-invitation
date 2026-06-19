import {
  ClockIcon,
  ImagesIcon,
  MapPinIcon,
  MusicNotesIcon,
  CalendarPlusIcon,
  ListHeartIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";

type FeatureIcon = ComponentType<IconProps>;

const FEATURE_ICONS: FeatureIcon[] = [
  ClockIcon,
  ImagesIcon,
  MapPinIcon,
  MusicNotesIcon,
  CalendarPlusIcon,
  ListHeartIcon,
];

export async function LandingFeatures() {
  const t = await getTranslations("landing");

  const features = FEATURE_ICONS.map((icon, i) => ({
    icon,
    title: t(`feature${i + 1}Title` as "feature1Title"),
    text: t(`feature${i + 1}Text` as "feature1Text"),
  }));

  return (
    <section
      id="features"
      style={{
        paddingBlock: "clamp(4rem, 10vw, 6rem)",
        paddingInline: "clamp(1rem, 4vw, 2rem)",
        background: "var(--color-bg-subtle)",
      }}
    >
      <div style={{ maxWidth: "72rem", marginInline: "auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(2.5rem, 5vw, 3.5rem)",
          }}
        >
          <p
            className="landing-section-label"
            style={{ justifyContent: "center" }}
          >
            <SparkleIcon weight="fill" size={12} />
            {t("featuresLabel")}
          </p>
          <h2 className="landing-section-title" style={{ marginTop: "1rem" }}>
            {t("featuresTitle")}
          </h2>
          <p className="landing-section-subtitle">{t("featuresSubtitle")}</p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <article key={i} className="feature-card">
                <div className="feature-card-icon" aria-hidden>
                  <Icon weight="duotone" size={22} />
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-text">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
