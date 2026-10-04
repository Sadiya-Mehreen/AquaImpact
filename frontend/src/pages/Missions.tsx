import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import type { Mission } from "../types";
import { Button } from "../components/Button";
import { CreditBurst } from "../components/CreditBurst";
import { ProgressBar } from "../components/ProgressBar";
import { useApp } from "../context/AppContext";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "nearby", label: "Nearby" },
  { id: "community", label: "Community" },
  { id: "weekly", label: "Weekly" },
  { id: "challenges", label: "Challenges" },
];

export function Missions() {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [burst, setBurst] = useState<Record<string, number>>({});

  useEffect(() => {
    api.missions().then(({ missions }) => setMissions(missions));
  }, []);

  async function handleComplete(m: Mission) {
    if (m.kind === "observation") {
      navigate("/observe");
      return;
    }
    setPendingId(m.id);
    try {
      const res = await api.completeMission(m.id);
      setUser(res.user);
      setMissions(res.missions);
      setBurst((b) => ({ ...b, [m.id]: Date.now() }));
    } catch (err: any) {
      showToast(err?.message ?? "Couldn't complete this mission right now.", "error");
    } finally {
      setPendingId(null);
    }
  }

  const filtered = missions?.filter((m) => (filter === "all" ? true : m.type === filter)) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      <h1 className="text-2xl text-aqua-900">Your Missions</h1>
      <p className="mt-1 text-sm text-aqua-900/60">Small actions. Real impact.</p>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.id ? "bg-aqua-gradient text-white shadow-aqua" : "bg-white text-aqua-900/60 border border-aqua-100 hover:bg-aqua-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {!missions && (
          <div className="flex justify-center py-16 text-aqua-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {missions && filtered.length === 0 && (
          <div className="aqua-card p-8 text-center text-sm text-aqua-900/50">No missions in this category yet — check back soon.</div>
        )}

        {filtered.map((m) => (
          <div key={m.id} className="aqua-card relative overflow-visible p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-aqua-lg">
            {burst[m.id] && <CreditBurst amount={m.reward} triggerKey={burst[m.id]} onDone={() => setBurst((b) => ({ ...b, [m.id]: 0 }))} />}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg text-aqua-900">{m.emoji} {m.title}</h3>
                <p className="mt-1.5 text-sm text-aqua-900/60">{m.description}</p>
              </div>
              {m.completed && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-500/15 text-leaf-600">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>

            {m.kind === "streak" && (
              <div className="mt-4">
                <ProgressBar value={m.progressCurrent ?? 0} max={m.progressTotal ?? 4} height={8} />
                <p className="mt-1.5 text-xs text-aqua-900/50">{m.progressCurrent ?? 0} / {m.progressTotal ?? 4} weeks</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-aqua-600">+{m.reward} Credits</span>
              {m.completed ? (
                <span className="text-sm font-medium text-aqua-900/40">Completed</span>
              ) : (
                <Button variant="primary" disabled={pendingId === m.id} onClick={() => handleComplete(m)}>
                  {pendingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Mission"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
