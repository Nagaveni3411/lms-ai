const createError = require("http-errors");
const videoRepository = require("./video.repository");
const subjectRepository = require("../subjects/subject.repository");
const progressRepository = require("../progress/progress.repository");
const { flattenSubjectTree, computeLockMap, getAdjacentVideoIds } = require("../../utils/ordering");

async function getVideo(videoId, userId) {
  const video = await videoRepository.findVideoWithRelations(videoId);
  if (!video || !video.is_published) throw createError(404, "Video not found");
  const tree = await subjectRepository.getSubjectTree(video.subject_id);
  if (!tree) throw createError(404, "Subject not found");
  const flat = flattenSubjectTree(tree.sections);
  const progressRows = await progressRepository.getProgressForSubject(userId, video.subject_id);
  const progressMap = new Map(progressRows.map((r) => [Number(r.video_id), r]));
  const lockMap = computeLockMap(flat, progressMap);
  const lock = lockMap.get(Number(video.id)) || { locked: false, unlock_reason: "unknown" };
  const adjacent = getAdjacentVideoIds(flat, Number(video.id));
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    youtube_url: video.youtube_url,
    order_index: video.order_index,
    duration_seconds: video.duration_seconds,
    section_id: video.section_id,
    section_title: video.section_title,
    subject_id: video.subject_id,
    subject_title: video.subject_title,
    previous_video_id: adjacent.previous_video_id,
    next_video_id: adjacent.next_video_id,
    locked: lock.locked,
    unlock_reason: lock.unlock_reason
  };
}

module.exports = { getVideo };

