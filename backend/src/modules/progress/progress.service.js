const createError = require("http-errors");
const db = require("../../config/db");
const progressRepository = require("./progress.repository");

async function getVideoProgress(userId, videoId) {
  const row = await progressRepository.getVideoProgress(userId, videoId);
  return { last_position_seconds: row?.last_position_seconds || 0, is_completed: row?.is_completed || false };
}

async function updateVideoProgress(userId, videoId, payload) {
  const video = await db("videos").where({ id: videoId }).first();
  if (!video) throw createError(404, "Video not found");
  let seconds = Number(payload.last_position_seconds || 0);
  if (!Number.isFinite(seconds)) seconds = 0;
  seconds = Math.max(0, Math.floor(seconds));
  if (video.duration_seconds && seconds > video.duration_seconds) seconds = video.duration_seconds;
  const isCompleted = Boolean(payload.is_completed);
  await progressRepository.upsertVideoProgress({
    userId,
    videoId,
    lastPositionSeconds: seconds,
    isCompleted
  });
  return { last_position_seconds: seconds, is_completed: isCompleted };
}

async function getSubjectProgressSummary(userId, subjectId) {
  const totalRow = await db("videos as v")
    .join("sections as s", "s.id", "v.section_id")
    .where("s.subject_id", subjectId)
    .count({ total: "*" })
    .first();
  const completedRow = await db("video_progress as vp")
    .join("videos as v", "v.id", "vp.video_id")
    .join("sections as s", "s.id", "v.section_id")
    .where("vp.user_id", userId)
    .andWhere("s.subject_id", subjectId)
    .andWhere("vp.is_completed", true)
    .count({ total: "*" })
    .first();
  const lastRow = await db("video_progress as vp")
    .join("videos as v", "v.id", "vp.video_id")
    .join("sections as s", "s.id", "v.section_id")
    .where("vp.user_id", userId)
    .andWhere("s.subject_id", subjectId)
    .orderBy("vp.updated_at", "desc")
    .select("vp.video_id as last_video_id", "vp.last_position_seconds")
    .first();
  const totalVideos = Number(totalRow.total || 0);
  const completedVideos = Number(completedRow.total || 0);
  return {
    total_videos: totalVideos,
    completed_videos: completedVideos,
    percent_complete: totalVideos ? Math.round((completedVideos / totalVideos) * 100) : 0,
    last_video_id: lastRow?.last_video_id || null,
    last_position_seconds: lastRow?.last_position_seconds || 0
  };
}

module.exports = { getVideoProgress, updateVideoProgress, getSubjectProgressSummary };

