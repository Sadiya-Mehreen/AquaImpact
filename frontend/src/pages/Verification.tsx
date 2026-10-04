import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { WaterWaves } from "../components/WaterWaves";
import { api } from "../lib/api";
import type { Reward, User } from "../types";
import { useApp } from "../context/AppContext";

interface VerificationState {
  observation: { locationName: string; creditsAwarded: number };
  breakdown: Record<string, number>;
  challenge: { before: number; after: number; goal: number };
  newAchievements: string[];
  user: User;
}

const BREAKDOWN_LABELS: Record<string, string> = {
  observation: "Observation",
  evidence: "Evidence",
  bonus: "Return visit bonus",
};

export function Verification() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as VerificationState | null;
  const { setUser } = useApp();

  const [phase, setPhase] = useState<"verifying" | "verified">("verifying");
  const [displayedProgress, setDisplayedProgress] = useState(state?.challenge.before ?? 0);
  const [nextReward, setNextReward] = useState<(Reward & { progressCredits: number }) | null>(null);

  useEffect(() => {
    if (!state) return;
    setUser(state.user);
    const t1 = setTimeout(() => setPhase("verified"), 1300);
    const t2 = setTimeout(() => setDisplayedProgress(state.challenge.after), 1700);
    api.passport().then(({ nextReward }) => setNextReward(nextReward));
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [state]);

  if (!state) {
    navigate("/observe", { replace: true });
    return null;
  }

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center overflow-hidden px-6 py-10 text-center">
      <AnimatePresence mode="wait">
        {phase === "verifying" ? (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-4"
          >
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua-300 opacity-40" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-aqua-gradient text-3xl shadow-aqua-lg">💧</span>
            </div>
            <p className="text-lg font-medium text-aqua-900">Observation received</p>
            <p className="text-sm text-aqua-900/55">Verifying your contribution...</p>
          </motion.div>
        ) : (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex w-full flex-1 flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf-500 text-white shadow-aqua-lg"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>
            <h1 className="mt-5 text-2xl text-aqua-900">Contribution verified</h1>

            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-2 font-display text-4xl text-aqua-600"
            >
              +{state.observation.creditsAwarded} Impact Credits
            </motion.p>

            <div className="aqua-card mt-6 w-full space-y-2 p-5 text-left">
              {Object.entries(state.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-aqua-900/60">{BREAKDOWN_LABELS[k] ?? k}</span>
                  <span className="font-semibold text-aqua-700">+{v}</span>
                </div>
              ))}
            </div>

            <div className="aqua-card mt-4 w-full p-5 text-left">
              <p className="text-sm text-aqua-900/70">
                Your observation has been added to the community's monitoring activity for <strong className="text-aqua-900">{state.observation.locationName}</strong>.
              </p>
            </div>

            <div className="aqua-card mt-4 w-full p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">Community Challenge</p>
              <p className="mt-2 text-xl font-semibold text-aqua-900">
                {displayedProgress.toLocaleString()} <span className="text-sm font-normal text-aqua-900/40">/ {state.challenge.goal.toLocaleString()}</span>
              </p>
              <ProgressBar value={displayedProgress} max={state.challenge.goal} className="mt-2" />
              <p className="mt-2 flex items-center gap-1.5 text-sm text-aqua-900/60">
                <Sparkles className="h-3.5 w-3.5 text-aqua-500" /> Your contribution moved the community one step closer.
              </p>
            </div>

            {nextReward && (
              <div className="aqua-card mt-4 w-full p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">Impact Passport</p>
                <p className="mt-2 text-sm text-aqua-900/70">
                  {nextReward.progressCredits.toLocaleString()} / {nextReward.cost.toLocaleString()} credits
                </p>
                <ProgressBar value={nextReward.progressCredits} max={nextReward.cost} className="mt-2" height={8} />
                <p className="mt-2 text-sm text-aqua-900/60">
                  Next unlock: {nextReward.emoji} {nextReward.title}
                </p>
              </div>
            )}

            {state.newAchievements.length > 0 && (
              <div className="mt-4 w-full rounded-2xl border border-aqua-200 bg-aqua-50 p-4 text-sm font-medium text-aqua-800">
                🏅 New achievement unlocked — check your Passport!
              </div>
            )}

            <Button variant="primary" fullWidth className="mt-6" onClick={() => navigate("/dashboard")}>
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <WaterWaves tone="aqua" className="opacity-40" />
    </div>
  );
}
