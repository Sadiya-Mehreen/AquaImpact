interface LogoProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  markOnly?: boolean;
  /** Subtle slow float + ripple pulse — reserved for hero/marketing contexts, off by default so dense UI (nav bars, modals) stays calm. */
  animated?: boolean;
}

const SIZE_TEXT: Record<string, string> = { sm: "text-base", md: "text-xl", lg: "text-3xl" };
const SIZE_BOX: Record<string, string> = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-11 w-11" };

export function LogoMark({ size = "md", animated = false }: { size?: "sm" | "md" | "lg"; animated?: boolean }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${SIZE_BOX[size]}`}>
      {animated && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-aqua-400/70 animate-logo-pulse"
        />
      )}
      <svg
        viewBox="0 0 24 24"
        className={`relative h-full w-full ${animated ? "animate-logo-float" : ""}`}
        role="img"
        aria-label="AquaImpact"
      >
        <defs>
          <linearGradient id="aquaimpact-drop" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1fa0b3" />
            <stop offset="100%" stopColor="#0d6272" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.3c.3 0 .58.14.76.39 1.26 1.73 2.63 3.68 3.75 5.63C17.86 10.6 19 12.84 19 14.7 19 18.7 15.87 22 12 22s-7-3.3-7-7.3c0-1.86 1.14-4.1 2.49-6.38 1.12-1.95 2.49-3.9 3.75-5.63.18-.25.46-.39.76-.39Z"
          fill="url(#aquaimpact-drop)"
        />
        <path
          d="M8.3 14.2c.3 2.1 1.9 3.5 3.9 3.7"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ size = "md", dark = false, markOnly = false, animated = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold ${SIZE_TEXT[size]} ${dark ? "text-white" : "text-aqua-900"}`}>
      <LogoMark size={size} animated={animated} />
      {!markOnly && "AquaImpact"}
    </span>
  );
}
