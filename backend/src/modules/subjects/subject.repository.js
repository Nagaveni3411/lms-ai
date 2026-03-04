const db = require("../../config/db");

function listPublishedSubjects({ page, pageSize, q }) {
  const query = db("subjects").where({ is_published: true });
  if (q) query.andWhere("title", "like", `%${q}%`);
  return query
    .orderBy("created_at", "desc")
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .select("id", "title", "slug", "description", "created_at");
}

function countPublishedSubjects({ q }) {
  const query = db("subjects").where({ is_published: true });
  if (q) query.andWhere("title", "like", `%${q}%`);
  return query.count({ count: "*" }).first();
}

function getSubjectById(subjectId) {
  return db("subjects").where({ id: subjectId }).first();
}

async function getSubjectTree(subjectId) {
  const subject = await getSubjectById(subjectId);
  if (!subject || !subject.is_published) return null;
  const sections = await db("sections").where({ subject_id: subjectId }).orderBy("order_index", "asc");
  const sectionIds = sections.map((s) => s.id);
  const videos = sectionIds.length
    ? await db("videos").whereIn("section_id", sectionIds).orderBy("order_index", "asc")
    : [];
  const videosBySection = videos.reduce((acc, video) => {
    if (!acc[video.section_id]) acc[video.section_id] = [];
    acc[video.section_id].push(video);
    return acc;
  }, {});
  return {
    id: subject.id,
    title: subject.title,
    slug: subject.slug,
    description: subject.description,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      order_index: section.order_index,
      videos: videosBySection[section.id] || []
    }))
  };
}

module.exports = {
  listPublishedSubjects,
  countPublishedSubjects,
  getSubjectById,
  getSubjectTree
};

