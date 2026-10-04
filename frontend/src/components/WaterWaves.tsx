interface WaterWavesProps {
  className?: string;
  tone?: "aqua" | "white" | "dark";
}

const TONES: Record<string, [string, string]> = {
  aqua: ["#bfeaf0", "#8fd9e3"],
  white: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.9)"],
  dark: ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.20)"],
};

export function WaterWaves({ className = "", tone = "aqua" }: WaterWavesProps) {
  const [c1, c2] = TONES[tone];
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden leading-[0] ${className}`} aria-hidden="true">
      <div className="flex w-[200%] animate-wave-drift-slower">
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 1200 120" className="h-16 w-1/2 md:h-24" preserveAspectRatio="none">
            <path d="M0,40 C150,90 350,0 600,40 C850,80 1050,10 1200,50 L1200,120 L0,120 Z" fill={c1} />
          </svg>
        ))}
      </div>
      <div className="-mt-10 flex w-[200%] animate-wave-drift-slow md:-mt-14">
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 1200 120" className="h-14 w-1/2 md:h-20" preserveAspectRatio="none">
            <path d="M0,60 C200,10 400,100 600,60 C800,20 1000,90 1200,50 L1200,120 L0,120 Z" fill={c2} />
          </svg>
        ))}
      </div>
    </div>
  );
}
