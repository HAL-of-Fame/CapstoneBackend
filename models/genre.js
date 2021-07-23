const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Genre {
  // fetch all posts of that genre
  static async fetchAllPostsByGenre(genre) {
      console.log("i made it in here")
      console.log('this is genre ', genre)
    const results = await db.query(
        `SELECT id, title, genre, text
         FROM posts
         WHERE genre = $1`,
      [genre]
    );
    console.log("this is results in model", results)
    const threads = results.rows;

    if (!threads) {
      throw new NotFoundError();
    }
    return threads;
  }
}

module.exports = Genre;
