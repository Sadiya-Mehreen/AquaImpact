import { useEffect, useState } from "react";
import { Users, MapPin, PartyPopper } from "lucide-react";
import { api } from "../lib/api";
import type { Challenge, ActivityItem, Location } from "../types";
import { ProgressBar } from "../components/ProgressBar";
import { WaterWaves } from "../components/WaterWaves";

// Illustrative pin positions (percent of the map panel) — not geographically precise.
const PIN_POSITION: Record<string, { top: string; left: string }> = {
  jakkur: { top: "22%", left: "58%" },
  hebbal: { top: "14%", left: "34%" },
  ulsoor: { top: "48%", left: "72%" },
  bellandur: { top: "78%", left: "56%" },
};

export function Community() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);

  useEffect(() => {
    api.challenge().then(({ challenge }) => setChallenge(challenge));
    api.communityActivity().then(({ activity }) => setActivity(activity));
    api.locations().then(({ locations }) => setLocations(locations));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      <h1 className="text-2xl text-aqua-900">Our Community</h1>
      <p className="mt-1 text-sm text-aqua-900/60">Together, we're monitoring the places we live.</p>

      {challenge && challenge.currentProgress >= challenge.goal && (
        <div className="relative mt-6 overflow-hidden rounded-[22px] bg-aqua-900 p-6 text-center text-white shadow-aqua-lg">
          <PartyPopper className="mx-auto h-7 w-7 text-aqua-200" />
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-aqua-200">Community Milestone Unlocked</p>
          <h2 className="mt-1 font-display text-2xl">🌊 Community Water Guardian</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/70">
            Everyone who contributed to this milestone receives the achievement in their Impact Passport.
          </p>
          <WaterWaves tone="dark" />
        </div>
      )}

      {/* Main challenge */}
      {challenge && (
        <div className="aqua-card mt-6 p-6">
          <h2 className="text-lg text-aqua-900">💧 {challenge.title}</h2>
          <p className="mt-2 flex items-baseline gap-1 text-2xl font-semibold text-aqua-900">
            {challenge.currentProgress.toLocaleString()} <span className="text-base font-normal text-aqua-900/40">/ {challenge.goal.toLocaleString()}</span>
          </p>
          <ProgressBar value={challenge.currentProgress} max={challenge.goal} className="mt-3" />
          <div className="mt-4 flex gap-6 text-sm text-aqua-900/70">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-aqua-500" /> {challenge.participantCount} contributors</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-aqua-500" /> {challenge.locationCount} locations</span>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="aqua-card mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-aqua-700">Recent activity</h2>
        <ul className="mt-4 space-y-4">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aqua-gradient text-xs font-semibold text-white">
                {a.userLabel.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-aqua-900">
                  <strong className="font-semibold">{a.userLabel}</strong> {a.action}
                  {a.locationName ? <> at <strong className="font-semibold">{a.locationName}</strong></> : null}
                </p>
                <p className="text-xs text-aqua-900/40">{a.timeLabel}</p>
              </div>
            </li>
          ))}
          {activity.length === 0 && <p className="text-sm text-aqua-900/40">No recent activity yet.</p>}
        </ul>
      </div>

      {/* Stylized map */}
      <div className="aqua-card mt-6 overflow-hidden p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-aqua-700">Community map</h2>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-aqua-100 via-aqua-50 to-leaf-400/20">
          <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 260" preserveAspectRatio="none">
            <path d="M0,150 C80,120 140,190 220,150 C300,110 340,170 400,140" stroke="#8fd9e3" strokeWidth="10" fill="none" />
          </svg>
          {locations.map((l) => {
            const pos = PIN_POSITION[l.id] ?? { top: "50%", left: "50%" };
            return (
              <button
                key={l.id}
                onClick={() => setSelected(l)}
                style={{ top: pos.top, left: pos.left }}
                className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:-translate-y-[110%]"
                aria-label={`View details for ${l.name}`}
              >
                <MapPin className={`h-7 w-7 drop-shadow ${selected?.id === l.id ? "text-aqua-700" : "text-aqua-500"}`} fill="currentColor" />
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="mt-4 rounded-2xl border border-aqua-100 bg-aqua-50/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-aqua-900">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-xs font-medium text-aqua-900/40 hover:text-aqua-700">Close</button>
            </div>
            <div className="mt-2 flex gap-5 text-sm text-aqua-900/70">
              <span>{selected.observationCount} observations</span>
              <span>{selected.contributorCount} contributors</span>
            </div>
            <p className="mt-1 text-xs text-aqua-900/50">Last observation: {selected.lastObservationLabel}</p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-aqua-900/40">Tap a pin to see location details.</p>
        )}
      </div>
    </div>
  );
}
