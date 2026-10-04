import { X, Printer } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import type { User } from "../types";

interface CertificateModalProps {
  user: User;
  achievementTitle: string;
  onClose: () => void;
}

export function CertificateModal({ user, achievementTitle, onClose }: CertificateModalProps) {
  const dateLabel = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-aqua-900/50 px-4 backdrop-blur-sm print:bg-white">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-aqua-900 shadow-aqua print:hidden"
          aria-label="Close certificate"
        >
          <X className="h-4 w-4" />
        </button>
        <div id="certificate" className="rounded-[26px] border-4 border-aqua-100 bg-white p-8 text-center shadow-aqua-lg">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-aqua-500">Impact Certificate</p>
          <h2 className="mt-3 font-display text-2xl text-aqua-900">{user.name}</h2>
          <p className="mt-2 text-sm text-aqua-900/60">is recognized as a</p>
          <p className="mt-1 font-display text-xl text-aqua-700">{achievementTitle}</p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3 border-y border-aqua-100 py-4 text-center">
            <div>
              <p className="text-lg font-semibold text-aqua-900">{user.verifiedObservations}</p>
              <p className="text-[11px] text-aqua-900/50">Observations</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-aqua-900">{user.locationsCount}</p>
              <p className="text-[11px] text-aqua-900/50">Locations</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-aqua-900">{user.impactCredits.toLocaleString()}</p>
              <p className="text-[11px] text-aqua-900/50">Credits</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-aqua-900/40">Issued {dateLabel} · AquaImpact Community Monitoring Prototype</p>
        </div>
        <div className="mt-4 flex justify-center print:hidden">
          <Button variant="primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
