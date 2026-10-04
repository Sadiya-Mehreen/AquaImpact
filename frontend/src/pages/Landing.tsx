import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, Send, Sparkles, Repeat, Droplet } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { WaterWaves } from "../components/WaterWaves";
import { HeroIllustration } from "../components/HeroIllustration";

const STEPS = [
  { n: "01", title: "Observe", desc: "Complete simple freshwater observations.", icon: Eye },
  { n: "02", title: "Contribute", desc: "Submit useful evidence to the community.", icon: Send },
  { n: "03", title: "Impact", desc: "Earn Impact Credits and help complete community goals.", icon: Sparkles },
  { n: "04", title: "Return", desc: "Build your environmental Impact Passport.", icon: Repeat },
];

/** Counts up to `target` once on mount (never re-triggers). Skips straight to the final value if the visitor prefers reduced motion. */
function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

export function Landing() {
  const navigate = useNavigate();
  const challengeCount = useCountUp(328);

  return (
    <div className="min-h-screen bg-aqua-soft">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Logo animated />
        <nav className="hidden items-center gap-8 text-sm font-medium text-aqua-900/70 md:flex">
          <a href="#how-it-works" className="nav-link transition-colors hover:text-aqua-700">How it works</a>
          <a href="#community" className="nav-link transition-colors hover:text-aqua-700">Community</a>
          <button onClick={() => navigate("/login")} className="nav-link transition-colors hover:text-aqua-700">Sign in</button>
        </nav>
        <Button variant="primary" className="hidden md:inline-flex" onClick={() => navigate("/signup")}>
          Join the Community
        </Button>
        <Button variant="secondary" className="md:hidden !px-4 !py-2 text-sm" onClick={() => navigate("/signup")}>
          Join
        </Button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 md:grid-cols-2 md:gap-8 md:px-8 md:pb-28 md:pt-10">
          <div>
            <span
              className="inline-flex animate-fade-up items-center gap-1.5 rounded-full bg-aqua-100 px-3 py-1 text-xs font-semibold text-aqua-700"
              style={{ animationDelay: "0ms" }}
            >
              IEEE OneAquaHealth Global Hackathon 2026
            </span>
            <h1
              className="mt-5 animate-fade-up text-4xl leading-[1.08] text-aqua-900 md:text-6xl"
              style={{ animationDelay: "90ms" }}
            >
              See it. Verify it. Change it.
            </h1>
            <p
              className="mt-5 max-w-md animate-fade-up text-base text-aqua-900/65 md:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              Turn everyday water observations into verified action, measurable impact, and community progress.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3" style={{ animationDelay: "270ms" }}>
              <Button variant="primary" className="group" onClick={() => navigate("/signup")}>
                Start Contributing
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button variant="secondary" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                See How It Works
              </Button>
            </div>
            <p className="mt-8 animate-fade-up text-sm text-aqua-900/45" style={{ animationDelay: "350ms" }}>
              Turn every observation into impact.
            </p>
          </div>
          <div className="relative animate-fade-right" style={{ animationDelay: "150ms" }}>
            <div className="aqua-card overflow-hidden p-0">
              <HeroIllustration className="w-full" />
            </div>
            <div
              className="glass absolute -bottom-5 left-5 right-5 flex animate-bob items-center justify-between rounded-2xl px-5 py-3 shadow-aqua-lg md:left-8 md:right-8"
              style={{ animationDelay: "900ms" }}
            >
              <div>
                <p className="text-xs text-aqua-900/60">Community Challenge</p>
                <p className="text-sm font-semibold text-aqua-900">{challengeCount} / 500 observations</p>
              </div>
              <Droplet className="h-6 w-6 shrink-0 fill-aqua-200 text-aqua-500" />
            </div>
          </div>
        </div>
        <WaterWaves tone="aqua" className="opacity-70" />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <h2 className="text-2xl text-aqua-900 md:text-3xl">How it works</h2>
        <p className="mt-2 max-w-md text-aqua-900/60">A simple loop that turns a single visit into lasting environmental stewardship.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="aqua-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-aqua-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-aqua-400">{s.n}</span>
                <s.icon className="h-5 w-5 text-aqua-500 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="mt-4 text-lg text-aqua-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-aqua-900/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community teaser */}
      <section id="community" className="relative overflow-hidden bg-aqua-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-4xl">328<span className="text-white/40">/500</span></p>
              <p className="mt-1 text-sm text-white/60">Community observations this season</p>
            </div>
            <div>
              <p className="font-display text-4xl">184</p>
              <p className="mt-1 text-sm text-white/60">Active contributors</p>
            </div>
            <div>
              <p className="font-display text-4xl">12</p>
              <p className="mt-1 text-sm text-white/60">Waterbodies monitored</p>
            </div>
          </div>
          <div className="mt-10">
            <Button variant="primary" className="group" onClick={() => navigate("/signup")}>
              Join the Community
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        <WaterWaves tone="dark" />
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-aqua-900/50 md:flex-row md:px-8">
        <Logo size="sm" />
        <p>Turn every observation into impact.</p>
      </footer>
    </div>
  );
}
