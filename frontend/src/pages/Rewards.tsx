import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Droplet } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { useApp } from "../context/AppContext";
import type { Reward } from "../types";
import { Button } from "../components/Button";

export function Rewards() {
  const navigate = useNavigate();
  const { user, setUser, showToast } = useApp();
  const [rewards, setRewards] = useState<Reward[] | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    api.rewards().then(({ rewards }) => setRewards(rewards));
  }, []);

  async function handleUnlock(r: Reward) {
    setPendingId(r.id);
    try {
      const res = await api.unlockReward(r.id);
      setUser(res.user);
      setRewards((rs) => rs?.map((x) => (x.id === r.id ? { ...x, unlocked: true } : x)) ?? null);
      showToast(`${r.emoji} ${r.title} unlocked!`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Couldn't unlock this reward.", "error");
    } finally {
      setPendingId(null);
    }
  }

  const available = rewards?.filter((r) => r.status === "available") ?? [];
  const locked = rewards?.filter((r) => r.status !== "available") ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium text-aqua-900/60 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="mt-4 text-2xl text-aqua-900">Impact Rewards</h1>

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-aqua-gradient px-5 py-4 text-white shadow-aqua">
        <Droplet className="h-5 w-5" />
        <span className="text-xl font-semibold">{user?.impactCredits.toLocaleString() ?? 0}</span>
        <span className="text-sm text-white/80">Impact Credits</span>
      </div>
      <p className="mt-3 text-sm text-aqua-900/60">Your contribution unlocks meaningful recognition and opportunities.</p>

      {!rewards && (
        <div className="flex justify-center py-16 text-aqua-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {rewards && (
        <>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-aqua-700">Available</h2>
          <div className="mt-4 space-y-4">
            {available.map((r) => (
              <div key={r.id} className="aqua-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-aqua-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg text-aqua-900">{r.emoji} {r.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-aqua-600">{r.cost.toLocaleString()} Credits</p>
                    <p className="mt-2 text-sm text-aqua-900/60">{r.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {r.unlocked ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-leaf-600">
                      <Check className="h-4 w-4" /> Unlocked
                    </span>
                  ) : (
                    <Button
                      variant={r.affordable ? "primary" : "secondary"}
                      disabled={!r.affordable || pendingId === r.id}
                      onClick={() => handleUnlock(r)}
                    >
                      {pendingId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : r.affordable ? (
                        r.id === "r3" ? "Choose Impact" : "Unlock"
                      ) : (
                        `Need ${(r.cost - (user?.impactCredits ?? 0)).toLocaleString()} more`
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-aqua-700">Locked future rewards</h2>
          <div className="mt-4 space-y-4">
            {locked.map((r) => (
              <div key={r.id} className="aqua-card p-6 opacity-70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg text-aqua-900">{r.emoji} {r.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-aqua-900/40">{r.cost.toLocaleString()} Credits</p>
                    <p className="mt-2 text-sm text-aqua-900/60">{r.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-aqua-100 px-3 py-1 text-xs font-semibold text-aqua-700">{r.label}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
