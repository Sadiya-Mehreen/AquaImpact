import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  height?: number;
  className?: string;
}

export function ProgressBar({ value, max, height = 10, className = "" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-aqua-100 ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <motion.div
        className="h-full rounded-full bg-aqua-gradient"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
