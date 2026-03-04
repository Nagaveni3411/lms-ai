function flattenSubjectTree(sections) {
  const orderedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const flat = [];
  for (const section of orderedSections) {
    const videos = [...(section.videos || [])].sort((a, b) => a.order_index - b.order_index);
    for (const video of videos) {
      flat.push({ ...video, section_id: section.id, section_title: section.title });
    }
  }
  return flat;
}

function getAdjacentVideoIds(flatVideos, videoId) {
  const idx = flatVideos.findIndex((v) => Number(v.id) === Number(videoId));
  if (idx === -1) return { previous_video_id: null, next_video_id: null };
  return {
    previous_video_id: idx > 0 ? flatVideos[idx - 1].id : null,
    next_video_id: idx < flatVideos.length - 1 ? flatVideos[idx + 1].id : null
  };
}

function computeLockMap(flatVideos, progressMap) {
  const lockMap = new Map();
  for (let i = 0; i < flatVideos.length; i += 1) {
    const current = flatVideos[i];
    const prerequisite = i > 0 ? flatVideos[i - 1] : null;
    if (!prerequisite) {
      lockMap.set(current.id, { locked: false, unlock_reason: "first_video" });
      continue;
    }
    const prerequisiteDone = progressMap.get(Number(prerequisite.id))?.is_completed === true;
    lockMap.set(current.id, prerequisiteDone
      ? { locked: false, unlock_reason: "prerequisite_completed" }
      : { locked: true, unlock_reason: "Complete previous video", prerequisite_video_id: prerequisite.id });
  }
  return lockMap;
}

module.exports = {
  flattenSubjectTree,
  getAdjacentVideoIds,
  computeLockMap
};

