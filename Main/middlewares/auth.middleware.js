const TokenService = require("../services/token-service");

const ApiError = require("../exceptions/api.error");

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies["x-social-auth"];

    const userData = await TokenService.validateAccessToken(accessToken);
    if (!userData) {
      next();
    }

    req.user = userData;
    next();
  } catch (error) {
    next();
  }
};

module.exports = authMiddleware;
