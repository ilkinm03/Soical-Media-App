const TokenService = require("../services/token-service");
const UserService = require("../services/user-service");

const logger = require("../logger/logger");
const ApiError = require("../exceptions/api.error");

const refreshMiddleware = async (req, res, next) => {
  try {
    logger.debug("refreshMiddleware -- START");

    if (req.user) return next();

    const refreshToken = req.cookies["x-social-refresh"];
    const newUserData = await UserService.refresh(refreshToken);

    if (!newUserData) {
      logger.warn("refreshMiddleware -- user not found");
      throw ApiError.UnauthorizedError("User not found!");
    }

    res.cookie("x-social-auth", newUserData.accessToken, {
      httpOnly: true,
      maxAge: 15 * 1000,
    });

    req.user = newUserData.user;

    logger.debug("refreshMiddleware -- SUCCESS");

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = refreshMiddleware;
