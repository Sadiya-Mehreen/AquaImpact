import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, MapPin, Flame, ArrowRight, Target, Globe2, IdCard, Gift } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../lib/api";
import type { Mission, Challenge } from "../types";
import { ProgressBar } from "../components/ProgressBar";
import { Button } from "../components/Button";
import { WaterWaves } from "../components/WaterWaves";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [mission, setMission] = useState<Mission | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [achievementTitle, setAchievementTitle] = useState<string>("Water Guardian");

  useEffect(() => {
    api.missions().then(({ missions }) => setMission(missions.find((m) => m.isToday) ?? null));
    api.challenge().then(({ challenge }) => setChallenge(challenge));
    api.passport().then(({ achievements }) => {
      const unlocked = achievements.filter((a) => a.unlocked);
      if (unlocked.length) setAchievementTitle(unlocked[unlocked.length - 1].title);
    });
  }, []);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      <div className="hidden items-center justify-between md:flex">
        <div>
          <p className="text-sm text-aqua-900/50">{greeting()},</p>
          <h1 className="text-2xl text-aqua-900">{user.name.split(" ")[0]} 👋</h1>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-aqua-gradient text-sm font-semibold text-white shadow-aqua">
          {user.name.charAt(0)}
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-sm text-aqua-900/50">{greeting()},</p>
        <h1 className="text-2xl text-aqua-900">{user.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-aqua-900/50">Together, we're building a healthier waterbody record.</p>
      </div>

      {/* Impact card */}
      <div className="relative mt-6 overflow-hidden rounded-[26px] bg-aqua-gradient p-6 text-white shadow-aqua-lg md:p-8">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-white/80">
              <Droplet className="h-4 w-4" /> Your Impact
            </p>
            <p className="mt-2 font-display text-5xl md:text-6xl">{user.impactCredits.toLocaleString()}</p>
            <p className="text-sm text-white/75">Impact Credits</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">+80 this week</span>
        </div>
        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="text-lg font-semibold">{user.verifiedObservations}</p>
            <p className="text-[11px] text-white/70">Verified Obs.</p>
          </div>
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="text-lg font-semibold">{user.locationsCount}</p>
            <p className="text-[11px] text-white/70">Locations</p>
          </div>
          <div className="rounded-2xl bg-white/10 py-3">
            <p className="flex items-center justify-center gap-1 text-lg font-semibold">
              {user.streak} <Flame className="h-4 w-4" />
            </p>
            <p className="text-[11px] text-white/70">Week Streak</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/rewards")}
          className="relative z-10 mt-5 flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-white"
        >
          <Gift className="h-4 w-4" /> View Impact Rewards <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <WaterWaves tone="white" className="opacity-40" />
      </div>

      {/* Today's mission */}
      {mission && (
        <div className="aqua-card mt-6 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-aqua-lg">
          <div className="flex items-center gap-2 text-aqua-700">
            <Target className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Today's Mission</h2>
          </div>
          <h3 className="mt-3 text-lg text-aqua-900">{mission.emoji} {mission.title}</h3>
          <p className="mt-1 text-sm text-aqua-900/60">Look around your selected location and record what you observe.</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-aqua-600">+{mission.reward} Impact Credits</span>
            {mission.completed ? (
              <span className="rounded-full bg-leaf-500/10 px-3.5 py-1.5 text-sm font-semibold text-leaf-600">Completed today ✓</span>
            ) : (
              <Button variant="primary" onClick={() => navigate("/observe")}>
                Start Mission <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Community challenge */}
      {challenge && (
        <div className="aqua-card mt-6 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-aqua-lg">
          <div className="flex items-center gap-2 text-aqua-700">
            <Globe2 className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Community Challenge</h2>
          </div>
          <h3 className="mt-3 text-lg text-aqua-900">{challenge.title}</h3>
          <p className="mt-3 flex items-baseline gap-1 text-2xl font-semibold text-aqua-900">
            {challenge.currentProgress.toLocaleString()} <span className="text-base font-normal text-aqua-900/40">/ {challenge.goal.toLocaleString()}</span>
          </p>
          <ProgressBar value={challenge.currentProgress} max={challenge.goal} className="mt-3" />
          <p className="mt-2 text-sm text-aqua-900/60">{(challenge.goal - challenge.currentProgress).toLocaleString()} observations to go!</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate("/community")}>
            View Challenge
          </Button>
        </div>
      )}

      {/* Passport preview */}
      <div className="aqua-card mt-6 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-aqua-lg">
        <div className="flex items-center gap-2 text-aqua-700">
          <IdCard className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Your Impact Passport</h2>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg text-aqua-900">{achievementTitle}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-aqua-900/60">
              <MapPin className="h-3.5 w-3.5" /> {user.verifiedObservations} verified contributions
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/passport")}>
            View Passport
          </Button>
        </div>
      </div>
    </div>
  );
}
