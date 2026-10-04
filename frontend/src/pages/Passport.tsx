import { useEffect, useState } from "react";
import { Loader2, MapPin, Camera, Trophy, Flame, FileDown, Share2 } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import type { Achievement, PassportTimelineItem } from "../types";
import { Button } from "../components/Button";
import { WaterWaves } from "../components/WaterWaves";
import { CertificateModal } from "../components/CertificateModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

export function Passport() {
  const { user, showToast } = useApp();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [timeline, setTimeline] = useState<PassportTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    api.passport().then(({ achievements, timeline }) => {
      setAchievements(achievements);
      setTimeline(timeline);
      setLoading(false);
    });
  }, []);

  async function handleShare() {
    const text = `I've made ${user?.verifiedObservations} verified freshwater observations with AquaImpact 💧 — turning every observation into impact.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My AquaImpact Passport", text });
      } catch {
        /* user cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast("Passport summary copied to clipboard.", "success");
    }
  }

  const unlockedTitle = achievements.filter((a) => a.unlocked).slice(-1)[0]?.title ?? "Citizen Scientist";

  if (loading || !user) {
    return (
      <div className="flex justify-center py-24 text-aqua-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[26px] bg-aqua-900 p-7 text-center text-white shadow-aqua-lg md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-aqua-200">AquaImpact</p>
        <h1 className="mt-1 font-display text-2xl md:text-3xl">Impact Passport</h1>
        <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-aqua-gradient text-xl font-semibold shadow-aqua-lg">
          {user.name.charAt(0)}
        </div>
        <p className="mt-3 text-lg">{user.name}</p>
        <p className="text-sm text-aqua-200">{unlockedTitle}</p>
        <WaterWaves tone="dark" />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-5">
        {[
          { label: "Verified observations", value: user.verifiedObservations, icon: MapPin },
          { label: "Locations", value: user.locationsCount, icon: MapPin },
          { label: "Evidence submissions", value: user.evidenceSubmissions, icon: Camera },
          { label: "Challenges completed", value: user.challengesCompleted, icon: Trophy },
          { label: "Week streak", value: user.streak, icon: Flame },
        ].map((s) => (
          <div key={s.label} className="aqua-card p-4 text-center">
            <s.icon className="mx-auto h-4 w-4 text-aqua-400" />
            <p className="mt-2 text-xl font-semibold text-aqua-900">{s.value}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-aqua-900/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="aqua-card mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-aqua-700">Contribution timeline</h2>
        <ol className="mt-4 space-y-5 border-l-2 border-aqua-100 pl-5">
          {timeline.map((t) => (
            <li key={t.id} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-aqua-gradient ring-4 ring-white" />
              <p className="text-xs font-semibold text-aqua-500">{formatDate(t.createdAt)}</p>
              <p className="mt-0.5 text-sm font-medium text-aqua-900">{t.locationName}</p>
              <p className="text-sm text-aqua-900/55">{t.kind}</p>
              <p className="mt-0.5 text-sm font-semibold text-aqua-600">+{t.creditsAwarded} credits</p>
            </li>
          ))}
          {timeline.length === 0 && <p className="text-sm text-aqua-900/40">Your contributions will appear here.</p>}
        </ol>
      </div>

      {/* Achievements */}
      <div className="aqua-card mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-aqua-700">Achievements</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 text-center transition-all ${
                a.unlocked ? "border-aqua-200 bg-aqua-50 shadow-aqua" : "border-aqua-50 bg-aqua-50/30 opacity-50 grayscale"
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <p className="mt-2 text-xs font-semibold text-aqua-900">{a.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact statement */}
      <div className="aqua-card mt-6 p-6">
        <p className="text-sm leading-relaxed text-aqua-900/70">
          Your contributions have helped your community build a larger record of freshwater observations across {user.locationsCount} locations.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" fullWidth onClick={() => setShowCertificate(true)}>
          <FileDown className="h-4 w-4" /> Generate Certificate
        </Button>
        <Button variant="secondary" fullWidth onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share Passport
        </Button>
      </div>

      {showCertificate && <CertificateModal user={user} achievementTitle={unlockedTitle} onClose={() => setShowCertificate(false)} />}
    </div>
  );
}
