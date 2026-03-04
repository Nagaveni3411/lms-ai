const service = require("./progress.service");

async function getSubjectProgress(req, res, next) {
  try {
    const data = await service.getSubjectProgressSummary(req.user.id, Number(req.params.subjectId));
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getVideoProgress(req, res, next) {
  try {
    const data = await service.getVideoProgress(req.user.id, Number(req.params.videoId));
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function postVideoProgress(req, res, next) {
  try {
    const data = await service.updateVideoProgress(req.user.id, Number(req.params.videoId), req.body || {});
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getSubjectProgress, getVideoProgress, postVideoProgress };

