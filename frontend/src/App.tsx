import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useApp } from "./context/AppContext";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Missions } from "./pages/Missions";
import { Observe } from "./pages/Observe";
import { Verification } from "./pages/Verification";
import { Community } from "./pages/Community";
import { Passport } from "./pages/Passport";
import { Rewards } from "./pages/Rewards";

function ProtectedArea() {
  const { user, loading } = useApp();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-aqua-soft">
        <Loader2 className="h-6 w-6 animate-spin text-aqua-500" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route path="/login" element={<Auth mode="login" />} />

      <Route element={<ProtectedArea />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/observe" element={<Observe />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/community" element={<Community />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/rewards" element={<Rewards />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
