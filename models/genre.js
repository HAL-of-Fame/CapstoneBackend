const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Genre {
  // fetch all posts of that genre
  static async fetchAllPostsByGenre(genre) {
    const results = await db.query(
        `SELECT id, title, genre, text
         FROM posts
         WHERE genre = $1`,
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
