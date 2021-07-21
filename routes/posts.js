/** Routes for authentication. */

const express = require("express");

const router = express.Router();
const security = require("../middleware/security"); // for middleware
const { createUserJwt } = require("../utils/tokens"); // to generate JWT tokens
const permissions = require("../middleware/permissions");
const Post = require("../models/posts");
const Rating = require("../models/rating")
// create a new post
router.post(
  "/",
  security.requireAuthenticatedUser,
  async function (req, res, next) {
    try {
      const { user } = res.locals;
      // console.log(req.body)
      const post = await Post.createNewPost({ user, post: req.body });
      return res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  }
);

// fetch all posts
router.get("/", async function (req, res, next) {
  try {
    const posts = await Post.listPosts();
    return res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
});

// fetch single post
router.get("/:postId", async function (req, res, next) {
  try {
    const { postId } = req.params;
    const post = await Post.fetchPostById(postId);
    return res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
});

// update a post. first security ensures that the user is authenticated
// second security ensures that that user is the owner of that post
// patch request for partial updates. put requests for full updates
router.patch(
  "/:postId",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsPost,
  async function (req, res, next) {
    try {
      const { postId } = req.params;
      const post = await Post.editPost({ postUpdate: req.body, postId });
      return res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  }
);

// delete a post with an id
router.delete(
  "/:postId",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsPost,
  async function (req, res, next) {
    try {
      const { postId } = req.params;
      const post = await Post.deletePostById(postId);
      return res.status(200).json({ message: "post deleted" });
    } catch (err) {
      next(err);
    }
  }
);

// create a rating for a post
router.post(
  "/:postId/ratings",
  security.requireAuthenticatedUser,
  permissions.authUserIsNotPostOwner,
  async function (req, res, next) {
    try {
      const { postId } = req.params //from the URL
      const { user } = res.locals // from the header in the JWT
      const rating = await Rating.createRatingForPost({ rating: req.body.rating, user, postId})
      return res.status(200).json({ rating });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
