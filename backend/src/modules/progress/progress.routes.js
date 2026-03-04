const router = require("express").Router();
const controller = require("./progress.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/subjects/:subjectId", authMiddleware, controller.getSubjectProgress);
router.get("/videos/:videoId", authMiddleware, controller.getVideoProgress);
router.post("/videos/:videoId", authMiddleware, controller.postVideoProgress);

module.exports = router;

