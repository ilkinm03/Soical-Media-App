require("dotenv").config();
const jwt = require("jsonwebtoken");

const TokenModel = require("../models/token.model");

const logger = require("../logger/logger");
const ApiError = require("../exceptions/api.error");

class TokenService {
  async generateTokens(userID) {
    try {
      logger.debug("TokenService.generateTokens -- START");

      const accessToken = jwt.sign({ userID }, process.env.JWT_ACCESS_KEY, {
        expiresIn: 5 * 60,
      });
      const refreshToken = jwt.sign({ userID }, process.env.JWT_REFRESH_KEY, {
        expiresIn: 30 * 24 * 60 * 60,
      });

      logger.debug("TokenService.generateTokens -- SUCCESS");

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async validateAccessToken(accessToken) {
    try {
      logger.debug("TokenService.validateAccessToken -- START");

      const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);

      logger.debug("TokenService.validateAccessToken -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateRefreshToken(refreshToken) {
    if (!refreshToken) {
      logger.debug("TokenService.validateRefreshToken -- null params");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }

    try {
      logger.debug("TokenService.validateRefreshToken -- START");

      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

      logger.debug("TokenService.validateRefreshToken -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async saveRefreshToken(userID, refreshToken) {
    try {
      logger.debug("TokenService.saveRefreshToken -- START");

      const token = await TokenModel.create({
        userID,
        refreshToken,
      });

      logger.debug("TokenService.saveRefreshToken -- SUCCESS");

      return token;
    } catch (error) {
      throw error;
    }
  }

  async removeRefreshToken(userID) {
    try {
      return await TokenModel.deleteOne({ userID });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TokenService();
