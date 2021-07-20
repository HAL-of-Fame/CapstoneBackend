const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Rating {
  // check if user has already added rating for this post
  // and throw error
  // otherwise insert rating into the db
  static async fetchRatingForPostByUser({ user, postId }) {
    const results = await db.query(
      `
          SELECT rating, user, post_id
          FROM ratings
          WHERE user_id = $1
            AND post_id = $2
          `,
      [user.id, postId]
    );
    return results.rows[0];
  }

  static async createRatingForPost({ rating, user, postId }) {
    if (!Number(rating) || Number(rating) <= 0 || Number(rating) > 5) {
      throw new BadRequestError(
        "Invalid rating provided, must be an integer between 1-5"
      );
    }

    const existingRating = await Rating.fetchRatingForPostByUser({
      user,
      postId,
    });
    if (existingRating) {
      throw new BadRequestError("Can't re-rate this post");
    }
    const results = await db.query(
      `
    INSERT INTO ratings (rating, user_id, post_id)
    VALUES ($1, $2, $3)
    RETURNING rating, user_id, post_id, created_at
    `,
      [rating, user.id, postId]
    );
    return results.rows[0];
  }
}

module.exports = Rating;
