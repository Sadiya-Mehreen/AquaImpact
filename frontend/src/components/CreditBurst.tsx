import { useEffect } from "react";
import { Droplet } from "lucide-react";

interface CreditBurstProps {
  amount: number;
  triggerKey: number;
  onDone?: () => void;
}

/** Renders a floating "+N Impact Credits" bubble that scales up, drifts upward, and fades — triggered whenever triggerKey changes. */
export function CreditBurst({ amount, triggerKey, onDone }: CreditBurstProps) {
  useEffect(() => {
    if (!triggerKey) return;
    const t = setTimeout(() => onDone?.(), 1600);
    return () => clearTimeout(t);
  }, [triggerKey, onDone]);

  if (!triggerKey) return null;

  return (
    <div
      key={triggerKey}
      className="pointer-events-none absolute left-1/2 top-0 z-20 flex -translate-x-1/2 animate-float-up items-center gap-1.5 whitespace-nowrap rounded-full border border-aqua-100 bg-white px-4 py-1.5 shadow-aqua-lg"
    >
      <Droplet className="h-4 w-4 fill-aqua-400 text-aqua-500" />
      <span className="text-sm font-semibold text-aqua-700">+{amount} Impact Credits</span>
    </div>
  );
}
