import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { register } from "../lib/auth";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const saveAuth = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      setError("");
      const data = await register(form);
      saveAuth({ user: data.user, accessToken: data.access_token });
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Register</h1>
      <p className="mb-4 text-sm text-slate-500">Create your LMS account.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button className="w-full py-3" type="submit">Register</Button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link className="text-blue-600" to="/login">Login</Link>
      </p>
    </div>
  );
}
