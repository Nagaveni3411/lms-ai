import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { login } from "../lib/auth";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const saveAuth = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setError("");
      const data = await login(form);
      saveAuth({ user: data.user, accessToken: data.access_token });
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Login</h1>
      <p className="mb-4 text-sm text-slate-500">Continue your learning journey.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button className="w-full py-3" type="submit">Login</Button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link className="text-blue-600" to="/register">Register</Link>
      </p>
    </div>
  );
}
