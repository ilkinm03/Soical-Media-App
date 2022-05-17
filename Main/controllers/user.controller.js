const UserService = require("../services/user-service");
const TokenService = require("../services/token-service");

const logger = require("../logger/logger");
const ApiError = require("../exceptions/api.error");

class UserController {
  async registration(req, res, next) {
    try {
      logger.debug("UserContoller.registration -- START");

      const { firstName, lastName, email, password, confirmPassword } =
        req.body;

      const user = await UserService.registration(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );

      logger.debug("UserController.registration -- SUCCESS");

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      logger.debug("UserController.login -- START");

      const { email, password } = req.body;

      const user = await UserService.login(email, password);

      const { accessToken, refreshToken } = await TokenService.generateTokens(
        user._id
      );

      await TokenService.saveRefreshToken(user._id, refreshToken);

      res.cookie("x-social-auth", accessToken, {
        httpOnly: true,
        maxAge: 15 * 1000, // 15 mins
      });
      res.cookie("x-social-refresh", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

      logger.debug(`UserController.logout -- SUCCESS`);

      res.status(200).send("User logged out successfully!");
    } catch (error) {
      next(error);
    }
  }

  async share(req, res, next) {
    try {
      logger.debug("UserController.share -- START");
      const { title, description } = req.body;
      const { id } = req.params;

      const user = await UserService.sharePost(id, title, description);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req, res, next) {
    try {
      logger.debug("UserController.getPosts -- START");
      const { id } = req.params;
      const posts = await UserService.getPosts(id);

      const cookie = req.cookies["x-social-refresh"];

      if (!cookie) {
        logger.warn("UserController.getPosts -- token not found");
        throw ApiError.UnauthorizedError("You are not logged in!");
      }

      logger.debug("UserController.getPosts -- SUCCESS");

      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
