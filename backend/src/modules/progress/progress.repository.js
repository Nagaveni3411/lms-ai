const db = require("../../config/db");

function getProgressForSubject(userId, subjectId) {
  return db("video_progress as vp")
    .join("videos as v", "v.id", "vp.video_id")
    .join("sections as s", "s.id", "v.section_id")
    .where("vp.user_id", userId)
    .andWhere("s.subject_id", subjectId)
    .select("vp.video_id", "vp.last_position_seconds", "vp.is_completed", "vp.updated_at");
}

function getVideoProgress(userId, videoId) {
  return db("video_progress").where({ user_id: userId, video_id: videoId }).first();
}

async function upsertVideoProgress({ userId, videoId, lastPositionSeconds, isCompleted }) {
  const existing = await getVideoProgress(userId, videoId);
  const now = new Date();
  const payload = {
    user_id: userId,
    video_id: videoId,
    last_position_seconds: lastPositionSeconds,
    is_completed: isCompleted,
    updated_at: now
  };
  if (isCompleted) payload.completed_at = now;
  if (!existing) return db("video_progress").insert({ ...payload, created_at: now });
  return db("video_progress").where({ id: existing.id }).update(payload);
}

module.exports = { getProgressForSubject, getVideoProgress, upsertVideoProgress };

