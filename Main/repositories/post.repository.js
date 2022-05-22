const PostModel = require("../models/post.model");

class PostRepository {
  async createPost(userID, title, description, image) {
    try {
      const post = await PostModel.create({
        userID,
        title,
        description,
        image: image.path,
      });

      return post;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PostRepository();
