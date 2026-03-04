import apiClient from "./apiClient";

const timers = new Map();

export function sendProgressDebounced(videoId, payload, delay = 700) {
  if (timers.has(videoId)) clearTimeout(timers.get(videoId));
  const timer = setTimeout(() => {
    apiClient.post(`/progress/videos/${videoId}`, payload).catch(() => {
      // Ignore network errors; retry naturally on next save.
    });
    timers.delete(videoId);
  }, delay);
  timers.set(videoId, timer);
}

