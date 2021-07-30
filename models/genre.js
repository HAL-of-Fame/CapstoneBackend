const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Genre {
  // fetch all posts of that genre
  static async fetchAllPostsByGenre(genre) {
    const results = await db.query(
        `SELECT p.id, 
                p.title, 
                p.genre, 
                p.text, 
                p.created_at,
                p.updated_at,
                u.username AS "userName"
         FROM posts as p
         LEFT JOIN users as u ON u.id = p.user_id
         WHERE genre = $1
         ORDER BY updated_at DESC
         `,
      [genre]
    );
    const threads = results.rows;

    if (!threads) {
      throw new NotFoundError();
    }
    return threads;
  }
}

module.exports = Genre;
