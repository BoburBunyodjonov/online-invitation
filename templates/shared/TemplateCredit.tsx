import { getSiteUrl } from "@/lib/seo/site-url";

const BRAND_NAME = "Taklifnoma";

/** Small “by …” footer on envelope-style templates. */
export function TemplateCredit({ className = "invite-credit" }: { className?: string }) {
  return (
    <footer className={className}>
      by{" "}
      <a
        className="invite-credit-link"
        href={getSiteUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={BRAND_NAME}
      >
        {BRAND_NAME}
      </a>
    </footer>
  );
}
