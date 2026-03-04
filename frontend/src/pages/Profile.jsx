import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

export default function Profile() {
  const [subjectId, setSubjectId] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!subjectId) return;
    apiClient.get(`/progress/subjects/${subjectId}`).then((res) => setSummary(res.data));
  }, [subjectId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <input className="rounded border p-2" placeholder="Enter Subject ID" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
      {summary ? <pre className="rounded border bg-slate-50 p-4 text-sm">{JSON.stringify(summary, null, 2)}</pre> : null}
    </div>
  );
}

