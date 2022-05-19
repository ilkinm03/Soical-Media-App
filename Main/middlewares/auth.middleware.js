require("dotenv").config();
const jwt = require("jsonwebtoken");

const TokenService = require("../service/token-service");

const logger = require("../logger/logger");

const authMiddleware = async (req, res, next) => {
  try {
    logger.debug("authMiddleware -- START");

    const accessToken = req.cookies["x-social-auth"];

    if (!accessToken) return next();

    const userData = TokenService.validateAccessToken(accessToken);

    req.user = userData;
    next();
  } catch {
    next();
  }
};

module.exports = authMiddleware;
