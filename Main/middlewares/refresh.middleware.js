const UserService = require("../service/user-service");

const logger = require("../logger/logger");
const ApiError = require("../exceptions/api.error");

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    logger.debug("refreshTokenMiddleware -- START");

    if (req.user) return next();

    const refreshToken = req.cookies["x-social-refresh"];
    const newUserData = await UserService.refresh(refreshToken);

    if (!newUserData) {
      logger.warn("refreshTokenMiddleware -- user not found");
      throw ApiError.UnauthorizedError("User not found!");
    }

    res.cookie("x-social-auth", newUserData.accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });

    req.user = newUserData.user;

    logger.debug("refreshTokenMiddleware -- SUCCESS");

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = refreshTokenMiddleware;
