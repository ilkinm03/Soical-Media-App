const bcrypt = require("bcrypt");

const UserRepository = require("../repositories/user.repository");
const PostRepository = require("../repositories/post.repository");
const TokenRepository = require("../repositories/token.repository");

const TokenService = require("../service/token-service");
const MailService = require("../service/mail-service");

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
    if (!refreshToken) {
      logger.debug("UserController.logout.UserService -- null params");
      throw ApiError.UnauthorizedError("You are not logged in!");
    }

    try {
      logger.debug("UserController.logout.UserService -- START");

      const user = await TokenService.validateRefreshToken(refreshToken);

      if (!user) {
        logger.warn("UserController.logout.UserService -- user not found");
        throw ApiError.NotFoundException("User not found!");
      }

      await TokenRepository.removeRefreshToken(user.userID);

      logger.debug("UserController.logout.UserService -- SUCCESS");
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    userID,
    currentPassword,
    newPassword,
    confirmNewPassword
  ) {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      logger.warn("UserController.updatePassword.UserService -- null params");
      throw ApiError.BadRequest("Please enter all the credentials!");
    }

    try {
      logger.debug("UserController.updatePassword.UserService -- START");

      const user = await UserRepository.findUserById(userID);

      if (!user) {
        logger.warn(
          "UserController.updatePassword.UserService -- user not found"
        );
        throw ApiError.NotFoundException("User not found!");
      }

      if (currentPassword === newPassword) {
        logger.warn(
          "UserController.updatePassword.UserService -- passwords are the same"
        );
        throw ApiError.BadRequest(
          "Current Password and New Password are the same!"
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        logger.warn(
          "UserController.updatePassword.UserService -- incorrect password"
        );
        throw ApiError.BadRequest("Password is incorrect!");
      }

      if (newPassword !== confirmNewPassword) {
        logger.warn("UserController.updatePassword.UserService -- not match");
        throw ApiError.BadRequest("Passwords not match!");
      }

      const hashPassword = await bcrypt.hash(newPassword, 12);

      const newUser = await UserRepository.findUserByIdAndUpdatePassword(
        userID,
        hashPassword
      );

      logger.debug("UserController.updatePassword.UserService -- SUCCESS");

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      logger.debug("UserController.forgotPassword.UserService -- START");

      const user = await UserRepository.findUserByEmail(email);

      if (!user) {
        logger.debug(
          "UserController.forgotPassword.UserService -- user not found"
        );
        throw ApiError.NotFoundException("User not found!");
      }

      const resetToken = await TokenService.generateResetToken(email);

      await UserRepository.updateUserResetToken(email, resetToken);
      await MailService.sendResetPasswordMail(
        email,
        `${process.env.API_URL}/auth/reset-password/${resetToken}`
      );

      logger.debug("UserController.forgotPassword.UserService -- SUCCESS");

      return { message: `Reset link has been set to ${email} address.` };
    } catch (error) {
      throw error;
    }
  }

  async getEmailResetPassword(token) {
    if (!token) {
      logger.warn(
        "UserController.getEmailResetPassword.UserService -- null param"
      );
      throw ApiError.BadRequest();
    }

    try {
      logger.debug("UserController.getEmailResetPassword.UserService -- START");

      const user = await UserRepository.findUserByResetToken(token);

      if (!user) {
        logger.warn(
          "UserController.getEmailResetPassword.UserService -- not found"
        );
        throw ApiError.NotFoundException("User not found!");
      }

      logger.debug(
        "UserController.getEmailResetPassword.UserService -- SUCCESS"
      );

      return user.email;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email, newPassword, confirmNewPassword) {
    if (!email || !newPassword || !confirmNewPassword) {
      logger.warn("UserController.resetPassword.UserService -- null params");
      throw ApiError.BadRequest("Please enter all the credentials!");
    }

    if (newPassword !== confirmNewPassword) {
      logger.warn("UserController.resetPassword.UserService -- not match");
      throw ApiError.BadRequest("Passwords not match!");
    }

    try {
      logger.debug("UserController.resetPassword.UserService -- START");

      const user = await UserRepository.findUserByEmail(email);

      if (!user) {
        logger.warn(
          "UserController.resetPassword.UserService -- user not found"
        );
        throw ApiError.NotFoundException("User not found!");
      }

      const hashPassword = await bcrypt.hash(newPassword, 12);

      const newUser = await UserRepository.findUserByIdAndUpdatePassword(
        user._id,
        hashPassword
      );

      await UserRepository.removeResetToken(newUser._id);

      logger.warn("UserController.resetPassword.UserService -- SUCCESS");

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async sharePost(userID, title, description, image) {
    try {
      logger.debug("UserController.sharePost.UserService -- START");

      const post = await PostRepository.createPost(
        userID,
        title,
        description,
        image
      );

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
