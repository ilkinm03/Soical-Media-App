const bcrypt = require("bcrypt");

const UserRepository = require("../repositories/user.repository");
const PostRepository = require("../repositories/post.repository");

const TokenService = require("../service/token-service");

const logger = require("../logger/logger");
const ApiError = require("../exceptions/api.error");

class UserService {
  async signup(firstName, lastName, email, password, confirmPassword) {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      logger.warn("UserController.signup.UserService -- null params");
      ApiError.BadRequest("Please enter all the credentials!");
    }

    try {
      const isEmailExists = await UserRepository.findUserByEmail(email);

      if (isEmailExists) {
        logger.warn("UserController.signup.UserService -- already exists");
        throw ApiError.ConflictException(`${email} is already registered!`);
      }

      if (password !== confirmPassword) {
        logger.warn("UserController.signup.UserService -- not match");
        throw ApiError.BadRequest("Passwords not match!");
      }

      const user = await UserRepository.createUser(
        firstName,
        lastName,
        email,
        password
      );

      if (!user) {
        logger.warn("UserController.signup.UserService - not created");
        throw ApiError.BadRequest();
      }

      logger.debug("UserController.signup.UserService -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    if (!email || !password) {
      logger.warn("UserController.login.UserService -- null params");

      throw ApiError.BadRequest("Please enter all the credentials!");
    }

    try {
      logger.debug("UserController.login.UserService -- START");

      const candidate = await UserRepository.findUserByEmail(email);

      if (!candidate) {
        logger.warn("UserController.login.UserService -- not found");

        throw ApiError.NotFoundException("Email not found!");
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        candidate.password
      );

      if (!isPasswordCorrect) {
        logger.warn("UserController.login.UserService -- incorrect password");

        throw ApiError.BadRequest("Incorrect email or password!");
      }

      logger.debug("UserController.login.UserService -- SUCCESS");

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  async refresh(refreshToken) {
    try {
      logger.debug("UserService.refresh -- START");

      const userData = await TokenService.validateRefreshToken(refreshToken);

      if (!userData) {
        logger.warn("UserService.refresh -- not found");
        throw ApiError.UnauthorizedError("You are not logged in!");
      }

      const user = await UserRepository.findUserById(userData.userID);

      if (!user) {
        logger.warn("UserService.refresh -- user not found");
        throw ApiError.UnauthorizedError("You are not logged in!");
      }

      const tokens = await TokenService.generateTokens(user._id);

      if (!tokens) {
        logger.warn("UserService.refresh -- tokens not found");
        throw ApiError.UnauthorizedError("You are not logged in!");
      }

      logger.debug("UserService.refresh -- SUCCESS");

      return { ...tokens, user: user._id };
    } catch (error) {
      throw error;
    }
  }

  async logout(refreshToken) {
    try {
      logger.debug("UserController.logout.UserService -- START");

      const user = await TokenService.validateRefreshToken(refreshToken);

      if (!user) {
        logger.warn("UserController.logout.UserService -- user not found");
        throw ApiError.NotFoundException("User not found!");
      }

      await TokenService.removeRefreshToken(user.userID);

      logger.debug("UserController.logout.UserService -- SUCCESS");
    } catch (error) {
      throw error;
    }
  }

  async sharePost(userID, title, description, image) {
    try {
      logger.debug("UserController.sharePost.UserService -- START");

      const post = await PostRepository.createPost(userID, title, description, image);

      if (!post) {
        logger.warn("UserController.sharePost.UserService -- post not created");
        throw ApiError.ForbiddenException("Post not created!");
      }

      const user = await UserRepository.findUserAndSavePost(userID, post);

      if (!user) {
        logger.warn("UserController.sharePost.UserService -- user not found");
        throw ApiError.NotFoundException("User not found!");
      }

      logger.debug("UserController.sharePost.UserService -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getPosts(userID) {
    try {
      logger.debug("UserController.getPosts.UserService -- START");

      const posts = await UserRepository.getPostsById(userID);

      if (!posts) {
        logger.warn("UserController.getPosts.UserService -- user not found");
        throw ApiError.NotFoundException("User not found!");
      }

      logger.debug("UserController.getPosts.UserService -- SUCCESS");

      return posts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
