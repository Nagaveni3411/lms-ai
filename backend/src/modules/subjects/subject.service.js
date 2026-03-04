const createError = require("http-errors");
const subjectRepository = require("./subject.repository");
const progressRepository = require("../progress/progress.repository");
const { flattenSubjectTree, computeLockMap } = require("../../utils/ordering");

async function listSubjects({ page = 1, pageSize = 10, q = "" }) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeSize = Math.min(Math.max(Number(pageSize) || 10, 1), 50);
  const [items, countRow] = await Promise.all([
    subjectRepository.listPublishedSubjects({ page: safePage, pageSize: safeSize, q }),
    subjectRepository.countPublishedSubjects({ q })
  ]);
  return { page: safePage, pageSize: safeSize, total: Number(countRow.count || 0), items };
}

async function getSubject(subjectId) {
  const subject = await subjectRepository.getSubjectById(subjectId);
  if (!subject || !subject.is_published) throw createError(404, "Subject not found");
  return subject;
}

async function getSubjectTree(subjectId, userId) {
  const tree = await subjectRepository.getSubjectTree(subjectId);
  if (!tree) throw createError(404, "Subject not found");
  const flat = flattenSubjectTree(tree.sections);
  const progressRows = await progressRepository.getProgressForSubject(userId, subjectId);
  const progressMap = new Map(progressRows.map((r) => [Number(r.video_id), r]));
  const lockMap = computeLockMap(flat, progressMap);
  return {
    ...tree,
    sections: tree.sections.map((section) => ({
      ...section,
      videos: (section.videos || []).map((video) => {
        const p = progressMap.get(Number(video.id));
        const lock = lockMap.get(video.id) || { locked: false };
        return {
          id: video.id,
          title: video.title,
          order_index: video.order_index,
          is_completed: p?.is_completed || false,
          locked: lock.locked
        };
      })
    }))
  };
}

async function getFirstUnlockedVideo(subjectId, userId) {
  const tree = await subjectRepository.getSubjectTree(subjectId);
  if (!tree) throw createError(404, "Subject not found");
  const flat = flattenSubjectTree(tree.sections);
  if (!flat.length) return { video_id: null };
  const progressRows = await progressRepository.getProgressForSubject(userId, subjectId);
  const progressMap = new Map(progressRows.map((r) => [Number(r.video_id), r]));
  const lockMap = computeLockMap(flat, progressMap);
  const firstUnlocked = flat.find((video) => !(lockMap.get(video.id)?.locked));
  return { video_id: firstUnlocked ? firstUnlocked.id : null };
}

module.exports = { listSubjects, getSubject, getSubjectTree, getFirstUnlockedVideo };

