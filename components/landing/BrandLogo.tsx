export function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 4.5c-2.2 2.8-5.4 4.2-8.8 4.2-.3 0-.6 0-.9-.1 1.2 5.8 5.8 10.2 11.7 10.2s10.5-4.4 11.7-10.2c-.3 0-.6.1-.9.1-3.4 0-6.6-1.4-8.8-4.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 18.5c1.2 2.4 2.8 4.2 4.5 5.8 1.7-1.6 3.3-3.4 4.5-5.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 10.5v4.5M13.8 12.8h4.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="16" cy="25.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
