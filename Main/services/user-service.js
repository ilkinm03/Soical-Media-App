const bcrypt = require("bcrypt");

const UserRepository = require("../repositories/user.repository");
const PostRepository = require("../repositories/post.repository");

const TokenService = require("../services/token-service");

const ApiError = require("../exceptions/api.error");
const logger = require("../logger/logger");
const tokenService = require("../services/token-service");

class UserService {
  async registration(firstName, lastName, email, password, confirmPassword) {
    logger.debug("UserController.registration.UserService -- START");

    const candidate = await UserRepository.findUserByEmail(email);

    if (candidate) {
      throw ApiError.BadRequest(`${email} is already registered!`);
    }

    if (password !== confirmPassword) {
      throw ApiError.BadRequest("Passwords not match!");
    }

    const user = await UserRepository.createUser(
      firstName,
      lastName,
      email,
      password
    );

    logger.debug("UserController.registration.UserService -- SUCCESS");

    return user;
  }

  async login(email, password) {
    logger.debug("UserController.login.UserService -- START");

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      logger.warn(
        `UserController.login.UserService -- not registered -- ${email}`
      );

      throw ApiError.BadRequest(`${email} is not registered!`);
    }

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch) {
      logger.warn(`UserController.login.UserService -- password is incorrect`);

      throw ApiError.BadRequest("Password is incorrect!");
    }

    logger.debug("UserController.login.UserService -- SUCCESS");

    return user;
  }

  async refresh(refreshToken) {
    logger.debug("UserService.refresh -- START");

    const userData = await TokenService.validateRefreshToken(refreshToken);

    if (!userData) {
      logger.warn("UserService.refresh -- not found!");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }

    const user = await UserRepository.findUserById(userData.payload);

    if (!user) {
      logger.warn("UserService.refresh -- user not found!");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }

    const tokens = await TokenService.generateTokens(user._id);

    if (!tokens) {
      logger.warn("UserService.refresh -- tokens not found!");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }

    logger.debug("UserService.refresh -- SUCCESS");

    return { ...tokens, user: user._id };
  }

  async logout(refreshToken) {
    logger.debug("UserService.logout -- START");

    const user = await TokenService.validateRefreshToken(refreshToken);

    if (!user) {
      logger.warn("UserService.logout -- user not found");
      throw ApiError.NotFoundException("User not found!");
    }

    await TokenService.removeToken(user.id);

    logger.debug("UserService.logout -- SUCCESS");
  }

  async sharePost(id, title, description) {
    logger.debug("UserController.sharePost.UserService -- START");

    const post = await PostRepository.createPost(id, title, description);
    const user = await UserRepository.findUserAndSharePost(id, post);

    if (!user) {
      logger.warn("UserRepository.getPostsById -- user not found");

      throw ApiError.NotFoundException(`User with id ${id} not found!`);
    }

    return user;
  }

  async getPosts(id) {
    logger.debug("UserController.getPosts.UserService -- START");

    const user = await UserRepository.getPostsById(id);

    if (!user) {
      logger.warn(`UserRepository.getPostsById -- null param -- ${user}`);

      throw ApiError.BadRequest();
    }

    logger.debug("UserController.getPosts.UserService -- START");

    return user;
  }
}

module.exports = new UserService();
