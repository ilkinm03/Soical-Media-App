const UserService = require("../service/user-service");
const TokenService = require("../service/token-service");

const logger = require("../logger/logger");

class UserController {
  async signup(req, res, next) {
    try {
      logger.debug("UserController.signup -- START");

      const { firstName, lastName, email, password, confirmPassword } =
        req.body;

      const user = await UserService.signup(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );

      logger.debug("UserController.signup -- SUCCESS");

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      logger.debug("UserController.login -- START");

      const { email, password } = req.body;

      const user = await UserService.login(email, password);
      const tokens = await TokenService.generateTokens(user._id);

      await TokenService.saveRefreshToken(user._id, tokens.refreshToken);

      res.cookie("x-social-auth", tokens.accessToken, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
      });
      res.cookie("x-social-refresh", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      logger.debug("UserController.login -- SUCCESS");

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      logger.debug("UserController.logout -- START");

      const refreshToken = req.cookies["x-social-refresh"];

      await UserService.logout(refreshToken);

      res.clearCookie("x-social-auth");
      res.clearCookie("x-social-refresh");

      logger.debug("UserController.logout -- SUCCESS");

      res.status(200).send("User logged out successfully!");
    } catch (error) {
      next(error);
    }
  }

  async sharePost(req, res, next) {
    try {
      logger.debug("UserController.sharePost -- START");

      const { title, description, image } = req.body;
      const { id } = req.params;

      const user = await UserService.sharePost(id, title, description, image);

      logger.debug("UserController.sharePost -- SUCCESS");

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req, res, next) {
    try {
      logger.debug("UserController.getPots -- START");

      const { id } = req.params;

      const posts = await UserService.getPosts(id);

      logger.debug("UserController.getPosts -- SUCCESS");

      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
