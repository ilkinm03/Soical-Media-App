const router = require("express").Router();

const UserController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const refreshMiddleware = require("../../middlewares/refresh.middleware");

const multer = require("../../setup/multer");

router.use(authMiddleware, refreshMiddleware);

router.post("/share/:id", multer.upload, UserController.share);

router.get("/posts/:id", UserController.getPosts);

module.exports = router;
