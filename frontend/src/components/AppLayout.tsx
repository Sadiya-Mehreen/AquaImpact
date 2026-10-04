import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Target, Camera, Users, IdCard, LogOut, RotateCcw, Gift } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "../context/AppContext";
import { api } from "../lib/api";
import { ToastHost } from "./Toast";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/missions", label: "Missions", icon: Target },
  { to: "/observe", label: "Observe", icon: Camera, emphasize: true },
  { to: "/community", label: "Community", icon: Users },
  { to: "/passport", label: "Passport", icon: IdCard },
];

export function AppLayout() {
  const { user, logout, showToast, refreshUser } = useApp();
  const navigate = useNavigate();

  async function handleReset() {
    await api.resetDemo();
    await refreshUser();
    showToast("Demo data reset to its starting state.", "success");
    navigate("/dashboard");
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-aqua-soft md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-aqua-100 bg-white/80 px-5 py-6 md:flex">
        <Logo size="md" />
        <nav className="mt-10 flex flex-1 flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-aqua-50 text-aqua-700" : "text-aqua-900/70 hover:bg-aqua-50/70 hover:text-aqua-800"
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              `mt-2 flex items-center gap-3 rounded-xl border-t border-aqua-100 px-3.5 pt-4 text-sm font-medium transition-colors ${
                isActive ? "text-aqua-700" : "text-aqua-900/50 hover:text-aqua-700"
              }`
            }
          >
            <Gift className="h-[18px] w-[18px]" />
            Impact Rewards
          </NavLink>
        </nav>
        {user && (
          <div className="space-y-3 border-t border-aqua-100 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua-gradient text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-aqua-900">{user.name}</p>
                <p className="truncate text-xs text-aqua-900/50">{user.impactCredits.toLocaleString()} credits</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-aqua-900/50 hover:bg-aqua-50 hover:text-aqua-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset demo data
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-aqua-900/50 hover:bg-aqua-50 hover:text-aqua-700"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="pt-safe sticky top-0 z-30 flex items-center justify-between border-b border-aqua-100/70 bg-white/85 px-4 py-3 backdrop-blur md:hidden">
          <Logo size="sm" />
          <button onClick={() => navigate("/passport")} aria-label="Open your profile">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-aqua-gradient text-xs font-semibold text-white">
              {user?.name.charAt(0) ?? "?"}
            </div>
          </button>
        </header>

        <main className="flex-1 pb-28 md:pb-10">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-aqua-100 bg-white/90 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md items-end justify-between px-3 pb-2 pt-1.5">
            {NAV_ITEMS.map((item) =>
              item.emphasize ? (
                <NavLink key={item.to} to={item.to} className="relative -mt-6 flex flex-col items-center gap-1">
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-full bg-aqua-gradient text-white shadow-aqua-lg ring-4 ring-white transition-transform ${
                          isActive ? "scale-105" : ""
                        }`}
                      >
                        <item.icon className="h-6 w-6" />
                      </span>
                      <span className={`text-[11px] font-medium ${isActive ? "text-aqua-700" : "text-aqua-900/50"}`}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1 px-2 py-1.5">
                  {({ isActive }) => (
                    <>
                      <item.icon className={`h-5 w-5 ${isActive ? "text-aqua-600" : "text-aqua-900/40"}`} />
                      <span className={`text-[11px] font-medium ${isActive ? "text-aqua-700" : "text-aqua-900/40"}`}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            )}
          </div>
        </nav>
      </div>
      <ToastHost />
    </div>
  );
}
