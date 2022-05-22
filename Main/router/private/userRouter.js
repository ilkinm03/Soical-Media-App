const router = require("express").Router();

const UserController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const refreshTokenMiddleware = require("../../middlewares/refresh.middleware");
const multer = require("../../setup/multer");

router.use(authMiddleware, refreshTokenMiddleware);

router.post("/share/:id", multer.upload, UserController.sharePost);
router.get("/posts/:id", UserController.getPosts);
router.patch("/update-password/:id", UserController.updatePassword);

module.exports = router;
