const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Post {
  // list all posts in db in descending order of creation
  static async listPosts() {
    const results = await db.query(
      `
      SELECT p.id,
             p.title,
             p.text,
             p.genre,
             p.user_id AS "userId",
             u.email AS "userEmail",
             AVG(r.rating) AS "rating",
             COUNT(r.rating) AS "totalRatings",
             p.created_at AS "createdAt",
             p.updated_at AS "updatedAt"
      FROM posts AS p
      LEFT JOIN users AS u ON u.id = p.user_id
      LEFT JOIN ratings AS r ON r.post_id = p.id
      GROUP BY p.id, u.email
      ORDER BY p.created_at DESC
      `
    );
    return results.rows;
  }
  // if you keep the join ratings then it'll only show all the posts that have 
  // been rated. JOIN ratings AS r ON r.user_id = p.user_id
  // r.rating AS "postRating",
  // LEFT JOIN ratings AS r ON r.post_id = p.id will get all the posts that even have 0 ratings


  // fetch a single post
  static async fetchPostById(postId) {
    const results = await db.query(
      `
      SELECT p.id,
             p.title,
             p.genre,
             p.text,
             p.user_id AS "userId",
             u.email AS "userEmail",
             AVG(r.rating) AS "rating",
             COUNT(r.rating) AS "totalRatings",
             u.username AS "userName",
             p.created_at AS "createdAt",
             p.updated_at AS "updatedAt"
      FROM posts AS p
          LEFT JOIN users AS u ON u.id = p.user_id
          LEFT JOIN ratings AS r ON r.post_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, u.username, u.email
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
    const requiredFields = ["title", "text", "genre"];
    requiredFields.forEach((field) => {
      if (!post.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });

    if (post.title.length > 140) {
      throw new BadRequestError(`Title text must be 140 characters or less`);
    }
    const results = await db.query(
      `
      INSERT INTO posts (text, user_id, title, genre)
      VALUES ($1, $2, $3, $4)
      RETURNING id AS "primaryKey",
                user_id,
                title,
                text,
                genre,
                created_at AS "createdAt",
                updated_at AS "updatedAt"  
                `,
      [post.text, user.id, post.title, post.genre]
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

module.exports = Post;
