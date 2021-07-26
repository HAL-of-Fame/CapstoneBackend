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
      GROUP BY c.id, u.email, u.username
      ORDER BY c.created_at DESC
      `
    );
    return results.rows;
  }
  // if you keep the join ratings then it'll only show all the posts that have 
  // been rated. JOIN ratings AS r ON r.user_id = p.user_id
  // r.rating AS "postRating",
  // LEFT JOIN ratings AS r ON r.post_id = p.id will get all the posts that even have 0 ratings


  // fetch a single comment
  static async fetchCommentById(postId) {
    const results = await db.query(
      `
      SELECT c.id,
             c.text,
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
      [postId]
    );
    const comment = results.rows[0];

    if (!comment) {
      throw new NotFoundError();
    }
    return comment;
  }





  // create a new comment
  static async createNewComment({ comment, user, postId }) {
      console.log(comment)
      console.log(user)
      console.log(postId)
      console.log("i am here")
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

  // edit a new post
  static async editPost({ postId, postUpdate }) {
    console.log("inside edit post model postUpdate", postUpdate)
    console.log('title', postUpdate.title)
    // console.log(postUpdate.hasOwnProperty('postUpdate'))
    const requiredFields = ["text", "title"];
    // postUpdate.forEach((field) => {console.log(field)})
    requiredFields.forEach((field) => {
      if (!postUpdate.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });
    console.log("i made it past the conditional")
    const results = await db.query(
      `
      UPDATE posts 
      SET text = $1,
          title = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING id,
                title,
                text,
                user_id AS "userId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
      `,
      [postUpdate.text, postUpdate.title, postId]
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

module.exports = Comment;
