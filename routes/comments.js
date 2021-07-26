/** Routes for authentication. */

const express = require("express");

const router = express.Router();
const security = require("../middleware/security"); // for middleware
const { createUserJwt } = require("../utils/tokens"); // to generate JWT tokens
const permissions = require("../middleware/permissions");
const Comment = require("../models/comments");

// create a new comment - DONE
router.post(
  "/:postId",
  security.requireAuthenticatedUser,
  async function (req, res, next) {
    try {
      const { postId } = req.params;
      const { user } = res.locals;
    //   console.log(postId)
    //   console.log(user)
      const comment = await Comment.createNewComment({
        user,
        postId,
        comment: req.body,
      });
      console.log("result", comment)
      return res.status(200).json({ comment });
    } catch (err) {
      next(err);
    }
  }
);

// fetch all comments at that postId - DONE
router.get("/:postId", async function (req, res, next) {
  try {
    const { postId } = req.params;
    const comments = await Comment.listComments({postId});
    return res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
});

// fetch single comment 
router.get("/:postId/detail", async function (req, res, next) {
  try {
    const { postId } = req.params;
    console.log("postId is", postId)
    const comment = await Comment.fetchCommentById(postId);
    return res.status(200).json({ comment });
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
      const comment = await Comment.editPost({
        commentUpdate: req.body,
        postId,
      });
      return res.status(200).json({ comment });
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
      const comment = await Comment.deletePostById(postId);
      return res.status(200).json({ message: "post deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
