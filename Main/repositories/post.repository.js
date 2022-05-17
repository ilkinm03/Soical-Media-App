const PostModel = require("../models/post.model");

const logger = require("../logger/logger");

class PostRepository {
  async createPost(id, title, description) {
    logger.debug("PostRepository.createPost -- START");

    const post = await PostModel.create({
      userID: id,
      title,
      description,
    });

    logger.debug("PostRepository.createPost -- SUCCESS");

    return post;
  }
  catch(error) {
    throw error;
  }
}

module.exports = new PostRepository();
