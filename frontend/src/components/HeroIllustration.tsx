export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 520" className={className} role="img" aria-label="Illustration of a lake at dusk with a person observing the water, ripples spreading across the surface">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eafaf9" />
          <stop offset="100%" stopColor="#c9edf1" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e93a8" />
          <stop offset="100%" stopColor="#0b6f80" />
        </linearGradient>
        <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fa77f" />
          <stop offset="100%" stopColor="#2f8a68" />
        </linearGradient>
        <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fbf9b" />
          <stop offset="100%" stopColor="#4dae86" />
        </linearGradient>
      </defs>

      <rect width="640" height="520" fill="url(#sky)" />
      <circle cx="500" cy="110" r="60" fill="#ffffff" opacity="0.55" />

      {/* distant hills */}
      <path d="M0,260 C90,210 180,230 260,260 C340,290 420,220 520,250 C580,268 620,255 640,258 L640,340 L0,340 Z" fill="url(#hill2)" opacity="0.55" />
      <path d="M0,290 C110,240 220,270 320,290 C420,310 500,260 640,285 L640,360 L0,360 Z" fill="url(#hill1)" opacity="0.75" />

      {/* water */}
      <rect x="0" y="330" width="640" height="190" fill="url(#water)" />

      {/* extremely subtle light glinting on the water surface */}
      <ellipse cx="380" cy="365" rx="170" ry="22" fill="#eafaf9" opacity="0.2" className="animate-shimmer" />

      {/* ripples — each slowly expands and fades, staggered for an organic feel */}
      <g
        opacity="0.55"
        fill="none"
        stroke="#e6fbfd"
        strokeWidth="2"
        className="animate-ripple-expand"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx="300" cy="390" r="26" />
        <circle cx="300" cy="390" r="46" opacity="0.6" />
        <circle cx="300" cy="390" r="66" opacity="0.3" />
      </g>
      <g
        opacity="0.4"
        fill="none"
        stroke="#e6fbfd"
        strokeWidth="2"
        className="animate-ripple-expand"
        style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "1.5s" }}
      >
        <circle cx="150" cy="430" r="16" />
        <circle cx="150" cy="430" r="30" opacity="0.5" />
      </g>
      <g
        opacity="0.4"
        fill="none"
        stroke="#e6fbfd"
        strokeWidth="2"
        className="animate-ripple-expand"
        style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "3s" }}
      >
        <circle cx="470" cy="450" r="18" />
        <circle cx="470" cy="450" r="34" opacity="0.5" />
      </g>

      {/* rock the observer sits on */}
      <ellipse cx="235" cy="365" rx="70" ry="20" fill="#0b4f5c" opacity="0.35" />
      <path d="M175,368 C185,335 235,320 270,335 C295,345 300,368 290,375 L180,375 Z" fill="#0f4f5c" />

      {/* observer — a very slight idle sway, like someone quietly watching the water */}
      <g className="animate-idle-sway" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <g transform="translate(205,300)">
          <ellipse cx="35" cy="70" rx="34" ry="10" fill="#0b2e33" opacity="0.15" />
          <path d="M10,68 C10,40 18,20 36,20 C54,20 62,40 62,68 Z" fill="#0e7c8c" />
          <circle cx="36" cy="10" r="12" fill="#0b2e33" />
          <rect x="6" y="55" width="14" height="26" rx="6" fill="#0e7c8c" />
          <rect x="52" y="46" width="14" height="30" rx="6" fill="#0e7c8c" />
          <rect x="56" y="30" width="18" height="18" rx="4" fill="#f6fbfc" transform="rotate(18 56 30)" />
        </g>
      </g>

      {/* birds */}
      <g stroke="#0b2e33" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M420,90 q10,-12 20,0 q10,-12 20,0" />
        <path d="M470,120 q8,-10 16,0 q8,-10 16,0" />
      </g>
    </svg>
  );
}
