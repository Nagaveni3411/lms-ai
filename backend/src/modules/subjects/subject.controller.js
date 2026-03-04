const service = require("./subject.service");

async function listSubjects(req, res, next) {
  try {
    const data = await service.listSubjects(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getSubject(req, res, next) {
  try {
    const data = await service.getSubject(Number(req.params.subjectId));
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getTree(req, res, next) {
  try {
    const data = await service.getSubjectTree(Number(req.params.subjectId), req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getFirstVideo(req, res, next) {
  try {
    const data = await service.getFirstUnlockedVideo(Number(req.params.subjectId), req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { listSubjects, getSubject, getTree, getFirstVideo };

