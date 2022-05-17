const router = require("express").Router();

const UserController = require("../../controllers/user.controller");

router.post("/signup", UserController.registration);

router.post("/login", UserController.login);

router.get("/logout", UserController.logout);

module.exports = router;
