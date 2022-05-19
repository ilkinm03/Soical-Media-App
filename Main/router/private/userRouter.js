const router = require("express").Router();

const UserController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const refreshTokenMiddleware = require("../../middlewares/refresh.middleware");

const multer = require("../../setup/multer");

router.use(authMiddleware, refreshTokenMiddleware);
router.post("/share/:id", UserController.sharePost);
router.get("/posts/:id", multer.upload, UserController.getPosts);

module.exports = router;
