import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubjectOverview from "./pages/SubjectOverview";
import VideoPage from "./pages/VideoPage";
import Profile from "./pages/Profile";
import AuthGuard from "./components/Auth/AuthGuard";
import { useAuthStore } from "./store/authStore";
import { logout as logoutApi } from "./lib/auth";

export default function App() {
  const { isAuthenticated, logout } = useAuthStore();
  const doLogout = async () => {
    await logoutApi();
    logout();
  };
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900">LMS</Link>
          <nav className="flex items-center gap-5 text-lg font-medium text-slate-800">
            <Link to="/" className="transition hover:text-blue-700">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="transition hover:text-blue-700">Profile</Link>
                <button className="transition hover:text-blue-700" onClick={doLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="transition hover:text-blue-700">Login</Link>
                <Link to="/register" className="transition hover:text-blue-700">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subjects/:subjectId" element={<AuthGuard><SubjectOverview /></AuthGuard>} />
          <Route path="/subjects/:subjectId/video/:videoId" element={<AuthGuard><VideoPage /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        </Routes>
      </main>
    </div>
  );
}
