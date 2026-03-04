import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../lib/apiClient";

export default function SubjectOverview() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/subjects/${subjectId}/first-video`).then((res) => {
      const first = res.data.video_id;
      if (first) navigate(`/subjects/${subjectId}/video/${first}`, { replace: true });
    });
  }, [navigate, subjectId]);

  return <div className="p-4 text-sm text-slate-600">Opening first unlocked video...</div>;
}

