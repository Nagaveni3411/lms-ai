const db = require("../../config/db");

function findBySubjectId(subjectId) {
  return db("sections").where({ subject_id: subjectId }).orderBy("order_index", "asc");
}

module.exports = { findBySubjectId };

