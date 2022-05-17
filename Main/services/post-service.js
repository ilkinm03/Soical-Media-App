const PostRepository = require("../repositories/post.repository");

const logger = require("../logger/logger");

class PostService {
  async createPost(title, description) {
    logger.debug("PostController.createPost.PostService -- START");

    const post = await PostRepository.createPost(title, description);

    logger.debug("PostController.createPost.PostService -- SUCCESS");

    return post;
  }
}

module.exports = new PostService();
