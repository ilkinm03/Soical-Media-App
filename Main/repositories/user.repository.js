const UserModel = require("../models/user.model");

class UserRepository {
  async findUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userID) {
    try {
      return await UserModel.findById(userID);
    } catch (error) {
      throw error;
    }
  }

  async findUserByResetToken(token) {
    try {
      return await UserModel.findOne({ resetPasswordToken: token });
    } catch (error) {
      throw error;
    }
  }

  async createUser(firstName, lastName, email, password) {
    try {
      return await UserModel.create({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      throw error;
    }
  }

  async findUserAndSavePost(userID, post) {
    try {
      return await UserModel.findByIdAndUpdate(
        userID,
        { $push: { posts: post } },
        { new: true }
      ).populate("posts");
    } catch (error) {
      throw error;
    }
  }

  async getPostsById(userID) {
    try {
      return await UserModel.findById(userID)
        .populate("posts")
        .select({ firstName: 1, lastName: 1, posts: 1 });
    } catch (error) {
      throw error;
    }
  }

  async findUserByIdAndUpdatePassword(userID, hashPassword) {
    try {
      return await UserModel.findByIdAndUpdate(userID, {
        password: hashPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserResetToken(email, resetToken) {
    try {
      return await UserModel.findOneAndUpdate(
        { email },
        { resetPasswordToken: resetToken }
      );
    } catch (error) {
      throw error;
    }
  }

  async removeResetToken(userID) {
    try {
      return UserModel.findByIdAndUpdate(userID, { resetPasswordToken: "" });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
