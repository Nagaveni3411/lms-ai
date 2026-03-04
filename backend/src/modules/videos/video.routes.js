const router = require("express").Router();
const controller = require("./video.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/:videoId", authMiddleware, controller.getVideo);

module.exports = router;

