require("dotenv").config();
const jwt = require("jsonwebtoken");

const TokenModel = require("../models/token.model");

const ApiError = require("../exceptions/api.error");
const logger = require("../logger/logger");

class TokenService {
  async generateTokens(payload) {
    logger.debug("TokenService.generateTokens -- START");

    const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_KEY, {
      expiresIn: 15 * 60, // 15 mins
    });
    const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_KEY, {
      expiresIn: 30 * 24 * 60 * 60, // 30 days
    });

    logger.debug("TokenService.generateTokens -- SUCCESS");

    return { accessToken, refreshToken };
  }

  async validateAccessToken(accessToken) {
    try {
      logger.debug("TokenService.validateAccessToken -- START");

      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);

      logger.debug("TokenService.validateAccessToken -- SUCCESS");

      return user;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(refreshToken) {
    if (!refreshToken) {
      logger.warn("TokenService.validateRefreshToken -- null param");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }
    try {
      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

      logger.debug("TokenService.validateRefreshToken -- SUCCESS");

      return user;
    } catch (error) {
      return null;
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    if (!userId || !refreshToken) {
      logger.warn("TokenService.saveRefreshToken -- null param");
      throw ApiError.BadRequest();
    }

    try {
      logger.debug("TokenService.saveRefreshToken -- START");

      const tokenData = await TokenModel.findOne({ userId });

      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
      }

      const token = await TokenModel.create({ userId, refreshToken });

      logger.debug("TokenService.saveRefreshToken -- SUCCESS");

      return token;
    } catch (error) {
      throw error;
    }
  }

  async removeToken(userId) {
    try {
      return await TokenModel.deleteOne({ userId });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TokenService();
