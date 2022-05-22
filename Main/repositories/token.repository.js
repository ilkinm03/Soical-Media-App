const TokenModel = require("../models/token.model");

const logger = require("../logger/logger");

class TokenRepository {
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

module.exports = new TokenRepository();
