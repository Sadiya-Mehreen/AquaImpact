import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { WaterWaves } from "../components/WaterWaves";
import { api, ApiError } from "../lib/api";
import { useApp } from "../context/AppContext";

interface AuthProps {
  mode: "signup" | "login";
}

export function Auth({ mode }: AuthProps) {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (isSignup && !name.trim()) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = isSignup ? await api.signup(name, email, password) : await api.login(email, password);
      api.setToken(res.token);
      setUser(res.user);
      showToast(isSignup ? `Welcome to AquaImpact, ${res.user.name.split(" ")[0]}!` : "Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const res = await api.demoLogin();
      api.setToken(res.token);
      setUser(res.user);
      showToast("Continue with Google is simulated in this prototype — signed in as the demo contributor.", "info");
      navigate("/dashboard");
    } catch {
      setSubmitError("Couldn't sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-aqua-soft">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <button onClick={() => navigate("/")} className="flex w-fit items-center gap-1.5 text-sm font-medium text-aqua-900/60 hover:text-aqua-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mt-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="mt-8 text-center text-2xl text-aqua-900">{isSignup ? "Join AquaImpact" : "Welcome back"}</h1>
        <p className="mt-2 text-center text-sm text-aqua-900/60">
          {isSignup ? "Turn your observations into real impact." : "Sign in to continue contributing."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          {isSignup && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-aqua-900/80">Full Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-aqua-900 outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100 ${errors.name ? "border-red-300" : "border-aqua-200"}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-aqua-900/80">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-aqua-900 outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100 ${errors.email ? "border-red-300" : "border-aqua-200"}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            {!isSignup && <p className="mt-1.5 text-xs text-aqua-900/40">Demo account: sadiya@aquaimpact.dev / demo1234</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-aqua-900/80">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-aqua-900 outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100 ${errors.password ? "border-red-300" : "border-aqua-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aqua-900/40 hover:text-aqua-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{submitError}</div>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-aqua-100" />
          <span className="text-xs text-aqua-900/40">or</span>
          <div className="h-px flex-1 bg-aqua-100" />
        </div>

        <Button variant="secondary" fullWidth onClick={handleGoogle} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.5 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.5 3.5 24 3.5c-7.7 0-14.3 4.4-17.7 11.2z" />
            <path fill="#4CAF50" d="M24 44.5c5.4 0 10.3-1.8 14.1-5l-6.5-5.5c-2.1 1.5-4.7 2.4-7.6 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.7 40.1 16.3 44.5 24 44.5z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.5C41.7 35.6 44.5 30.2 44.5 24c0-1.2-.1-2.4-.3-3.5z" />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-aqua-900/60">
          {isSignup ? (
            <>Already contributing? <button className="font-semibold text-aqua-700 hover:underline" onClick={() => navigate("/login")}>Sign in</button></>
          ) : (
            <>New here? <button className="font-semibold text-aqua-700 hover:underline" onClick={() => navigate("/signup")}>Join AquaImpact</button></>
          )}
        </p>

        {isSignup && (
          <p className="mt-6 text-center text-xs leading-relaxed text-aqua-900/40">
            By participating, you agree that submitted observations may be used for environmental and community monitoring
            according to AquaImpact's data policy.
          </p>
        )}
      </div>
      <WaterWaves tone="aqua" className="opacity-60" />
    </div>
  );
}
