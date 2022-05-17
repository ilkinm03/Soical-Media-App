const UserModel = require("../models/user.model");

const ApiError = require("../exceptions/api.error");
const logger = require("../logger/logger");

class UserRepository {
  async findUserByEmail(email) {
    logger.debug("UserRepository.findUserByEmail -- START");

    if (!email) {
      logger.warn(
        `UserRepository.findOneByEmail -- null param -- ${JSON.stringify(
          email
        )}`
      );

      throw ApiError.BadRequest("Email is required!");
    }

    try {
      const user = await UserModel.findOne({ email });

      logger.debug("UserRepository.findUserByEmail -- SUCCESS");

      return user;
    } catch (error) {
      logger.error(
        `UserRepository.findUserByEmail -- ${JSON.stringify(error.message)}`
      );

      throw ApiError.NotFoundException(`User with email: ${email} Not Found!`);
    }
  }

  async findUserById(id) {
    try {
      logger.debug("UserRepository.findUserById -- START");

      const user = await UserModel.findById(id);

      logger.debug("UserRepository.findUserById -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getPostsById(id) {
    try {
      logger.debug("UserRepository.getPostsById -- START");

      const user = await UserModel.findById(id)
        .select({ posts: 1, _id: 0 })
        .populate("posts");

      logger.debug("UserRepository.getPostsById -- SUCCESS");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(firstName, lastName, email, password) {
    logger.debug("UserRepository.createUser -- START");

    if (!firstName || !lastName || !email || !password) {
      logger.warn("UserRepository.createUser -- null param");

      throw ApiError.BadRequest("Plase enter all the credentials!");
    }

    try {
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
      });

      logger.debug("UserRepository.createUser -- SUCCESS");

      return user;
    } catch (error) {
      logger.error(
        `UserRepository.createUser -- ${JSON.stringify(error.message)}`
      );

      throw error;
    }
  }

  async findUserAndSharePost(id, post) {
    try {
      logger.debug("UserRepository.getPostsById -- START");

      const user = await UserModel.findByIdAndUpdate(
        id,
        {
          $push: { posts: post },
        },
        { new: true }
      ).populate("posts", { title: 1, description: 1 });

      logger.debug("UserRepository.getPostsById -- SUCCESS");

      return user;
    } catch (error) {
      logger.error(
        `UserRepository.getPostsById -- ${JSON.stringify(error.message)}`
      );

      throw error;
    }
  }
}

module.exports = new UserRepository();
