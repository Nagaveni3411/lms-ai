import { useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";

function extractYoutubeId(urlOrId) {
  if (!urlOrId) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const parts = url.pathname.split("/");
    return parts.includes("embed") ? parts[parts.indexOf("embed") + 1] : null;
  } catch {
    return null;
  }
}

export default function VideoPlayer({ youtubeUrl, startPositionSeconds, onProgress, onCompleted }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const ytVideoId = useMemo(() => extractYoutubeId(youtubeUrl), [youtubeUrl]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  if (!ytVideoId) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">Video unavailable.</div>;
  }

  const clearTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (playerRef.current) {
      const current = await playerRef.current.getCurrentTime();
      onProgress(Math.floor(current));
    }
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (!playerRef.current) return;
      const current = await playerRef.current.getCurrentTime();
      onProgress(Math.floor(current));
    }, 5000);
  };

  return (
    <YouTube
      videoId={ytVideoId}
      opts={{ playerVars: { start: startPositionSeconds || 0 } }}
      className="w-full"
      iframeClassName="aspect-video w-full rounded-lg"
      onReady={(event) => {
        playerRef.current = event.target;
      }}
      onStateChange={async (event) => {
        if (event.data === 1) startTimer();
        if (event.data === 2) await clearTimer();
        if (event.data === 0) {
          await clearTimer();
          onCompleted();
        }
      }}
    />
  );
}

