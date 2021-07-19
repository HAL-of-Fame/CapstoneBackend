const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Post {
  // list all posts in db in descending order of creation
  static async listPosts() {
    const results = await db.query(
      `
      SELECT p.id,
             p.caption,
             p.user_id AS "userId",
             u.email AS "userEmail",
             p.created_at AS "createdAt",
             p.updated_at AS "updatedAt"
      FROM posts AS p
      JOIN users AS u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      `
    );
    return results.rows;
  }

  // fetch a single post
  static async fetchPostById(postId) {
    const results = await db.query(
      `
      SELECT p.id,
             p.caption,
             p.user_id AS "userId",
             u.email AS "userEmail",
             u.username AS "userName",
             p.created_at AS "createdAt",
             p.updated_at AS "updatedAt"
      FROM posts AS p
          JOIN users AS u ON u.id = p.user_id
      WHERE p.id = $1
    `,
      [postId]
    );
    const post = results.rows[0];

    if (!post) {
      throw new NotFoundError();
    }
    return post;
  }

  // create a new post
  static async createNewPost({ post, user }) {
    const requiredFields = ["caption"];
    requiredFields.forEach((field) => {
      if (!post.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });

    if (post.caption.length > 140) {
      throw new BadRequestError(`Post caption must be 140 characters or less`);
    }
    const results = await db.query(
      `
      INSERT INTO posts (caption, user_id)
      VALUES ($1, $2)
      RETURNING id AS "primaryKey",
                user_id,
                caption,
                created_at AS "createdAt",
                updated_at AS "updatedAt"  
                `,
      [post.caption, user.id]
    );
    return results.rows[0];
  }

  // edit a new post
  static async editPost({ postId, postUpdate }) {
    const requiredFields = ["caption"];
    requiredFields.forEach((field) => {
      if (!postUpdate.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });
    const results = await db.query(
      `
      UPDATE posts 
      SET caption = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id,
                caption,
                user_id AS "userId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
      `,
      [postUpdate.caption, postId]
    );
    return results.rows[0];
  }

  static async deletePostById(postId) {
    const results = await db.query(
      `
      DELETE FROM posts
      WHERE id = $1
    `,
      [postId]
    );
    const post = results.rows[0];
    return post;
  }
}

module.exports = Post;
