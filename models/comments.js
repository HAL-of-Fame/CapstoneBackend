const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Comment {
  // list all comments in db in descending order of creation
  static async listComments(postId) {
    const results = await db.query(
      `
      SELECT c.id,
             c.text,
             c.post_id,
             c.user_id AS "userId",
             u.email AS "userEmail",    
             u.username AS "userName",   
             c.created_at AS "createdAt",
             c.updated_at AS "updatedAt"
      FROM comments AS c
      LEFT JOIN users AS u ON u.id = c.user_id
      WHERE c.post_id = $1
    GROUP BY c.id, u.email, u.username
      ORDER BY c.created_at DESC
      `,
      [postId]
    );
    return results.rows;
  }
  // if you keep the join ratings then it'll only show all the posts that have
  // been rated. JOIN ratings AS r ON r.user_id = p.user_id
  // r.rating AS "postRating",
  // LEFT JOIN ratings AS r ON r.post_id = p.id will get all the posts that even have 0 ratings

  // fetch a single comment
  static async fetchCommentById(commentId) {
    const results = await db.query(
      `
      SELECT c.id,
             c.text,
             c.post_id,
             c.user_id AS "userId",
             u.email AS "userEmail",
             u.username AS "userName",
             c.created_at AS "createdAt",
             c.updated_at AS "updatedAt"
      FROM comments AS c
          LEFT JOIN users AS u ON u.id = c.user_id
      WHERE c.id = $1
      GROUP BY c.id, u.username, u.email
    `,
      [commentId]
    );
    const comment = results.rows[0];

    if (!comment) {
      throw new NotFoundError();
    }
    return comment;
  }

  // create a new comment
  static async createNewComment({ comment, user, postId }) {
    const requiredFields = ["text"];
    requiredFields.forEach((field) => {
      if (!comment.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });

    const results = await db.query(
      `
      INSERT INTO comments (text, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING id AS "primaryKey",
                user_id,
                post_id,
                text,
                created_at AS "createdAt",
                updated_at AS "updatedAt"  
                `,
      [comment.text, user.id, postId]
    );
    return results.rows[0];
  }

  // edit a new comment
  static async editComment({ commentId, commentUpdate }) {
    const requiredFields = ["text"];
    requiredFields.forEach((field) => {
      if (!commentUpdate.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });
    const results = await db.query(
      `
      UPDATE comments 
      SET text = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id,
                text,
                user_id AS "userId",
                post_id AS "postId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
      `,
      [commentUpdate.text, commentId]
    );
    return results.rows[0];
  }

  static async deleteCommentById(commentId) {
    const results = await db.query(
      `
      DELETE FROM comments
      WHERE id = $1
    `,
      [commentId]
    );
    const comment = results.rows[0];
    return comment;
  }
}

module.exports = Comment;
