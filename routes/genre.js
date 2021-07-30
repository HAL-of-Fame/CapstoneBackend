/** Routes for authentication. */

const express = require("express");

const router = express.Router();
const security = require("../middleware/security"); // for middleware
const { createUserJwt } = require("../utils/tokens"); // to generate JWT tokens
const permissions = require("../middleware/permissions");
const Genre = require("../models/genre");

// fetch all posts in a genre
router.get("/:genre", async function (req, res, next) {
    try {
      const { genre } = req.params;
      // console.log("this is genre", genre)
      const threads = await Genre.fetchAllPostsByGenre(genre);
      // console.log("this is threads", threads)
      return res.status(200).json({ threads });
    } catch (err) {
      next(err);
    }
  });

  module.exports = router