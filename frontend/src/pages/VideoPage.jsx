import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/Layout/AppShell";
import SubjectSidebar from "../components/Sidebar/SubjectSidebar";
import VideoMeta from "../components/Video/VideoMeta";
import VideoPlayer from "../components/Video/VideoPlayer";
import Alert from "../components/common/Alert";
import apiClient from "../lib/apiClient";
import { sendProgressDebounced } from "../lib/progress";
import { useSidebarStore } from "../store/sidebarStore";

export default function VideoPage() {
  const { subjectId, videoId } = useParams();
  const navigate = useNavigate();
  const { tree, setTree, markVideoCompleted } = useSidebarStore();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState({ last_position_seconds: 0, is_completed: false });
  const [error, setError] = useState("");
  const [completedAll, setCompletedAll] = useState(false);

  useEffect(() => {
    apiClient.get(`/subjects/${subjectId}/tree`).then((res) => setTree(res.data)).catch(() => setError("Failed to load subject tree"));
  }, [setTree, subjectId]);

  useEffect(() => {
    async function load() {
      try {
        setError("");
        setCompletedAll(false);
        const [videoRes, progressRes] = await Promise.all([
          apiClient.get(`/videos/${videoId}`),
          apiClient.get(`/progress/videos/${videoId}`)
        ]);
        setVideo(videoRes.data);
        setProgress(progressRes.data);
      } catch {
        setError("Failed to load video page");
      }
    }
    load();
  }, [videoId]);

  const locked = useMemo(() => video?.locked, [video]);

  const saveProgress = (seconds) => {
    sendProgressDebounced(Number(videoId), { last_position_seconds: seconds, is_completed: false });
  };

  const complete = async () => {
    await apiClient.post(`/progress/videos/${videoId}`, {
      last_position_seconds: video?.duration_seconds || progress.last_position_seconds || 0,
      is_completed: true
    });
    markVideoCompleted(Number(videoId));
    if (video?.next_video_id) {
      navigate(`/subjects/${subjectId}/video/${video.next_video_id}`);
      return;
    }
    setCompletedAll(true);
  };

  return (
    <AppShell sidebar={<SubjectSidebar tree={tree} />}>
      {!video ? (
        <div>Loading...</div>
      ) : (
        <>
          {error ? <Alert>{error}</Alert> : null}
          <VideoMeta title={video.title} description={video.description} />
          {locked ? (
            <Alert>Complete previous video</Alert>
          ) : (
            <VideoPlayer
              youtubeUrl={video.youtube_url}
              startPositionSeconds={progress.last_position_seconds}
              onProgress={saveProgress}
              onCompleted={complete}
            />
          )}
          {completedAll ? <Alert>You completed all videos in this subject.</Alert> : null}
        </>
      )}
    </AppShell>
  );
}
