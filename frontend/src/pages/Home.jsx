import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiClient
      .get("/subjects")
      .then((res) => {
        if (!mounted) return;
        setSubjects(res.data.items || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load subjects");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="brand-gradient relative overflow-hidden rounded-2xl p-7 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">Learning Path</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">Subjects</h1>
          <p className="mt-2 text-sm leading-6 text-blue-50">
            Follow a structured order, track progress, and resume exactly where you left off.
          </p>
        </div>
      </section>

      {loading ? <p className="text-sm text-slate-500">Loading subjects...</p> : null}
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {!loading && !error && subjects.length === 0 ? (
        <p className="text-sm text-slate-500">No published subjects yet. Seed demo data from backend.</p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subjects/${subject.id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <div className="mb-2 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400" />
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-700">{subject.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{subject.description}</p>
            <div className="mt-4 text-sm font-semibold text-[#0a4dcf]">Start learning</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
