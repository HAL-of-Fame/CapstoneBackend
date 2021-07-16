const db = require("../db");
class Post {
  static async listPosts() {
    // list all posts in db in descending order of creation
  }

  static async fetchPostById({ postId }) {
    // fetch a single post
  }

  static async createNewPost({ post, user }) {
    // create a new post
  }

  static async editPost({ postId, postUpdate }) {
    // edit a new post
  }
}

module.exports = Post