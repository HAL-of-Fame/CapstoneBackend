/** Routes for authentication. */

const express = require("express");

const router = express.Router();
const security = require("../middleware/security"); // for middleware
const { createUserJwt } = require("../utils/tokens"); // to generate JWT tokens
const permissions = require("../middleware/permissions");
const Comment = require("../models/comments");

// fetch all comments at that postId 
router.get("/:postId/", async function (req, res, next) {
  try {
    let { postId } = req.params;
    postId = Number(postId)
    const comments = await Comment.listComments(postId);
    return res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
});

// create a new comment 
router.post(
    "/:postId",
    security.requireAuthenticatedUser,
  async function (req, res, next) {
    // console.log("req.params", req.params)
    // console.log("req.body", req.body)
    // console.log("res.locals, users", res.locals)
    try {
      const { comment } = req.body;
      const { postId } = req.params;
      const { user } = res.locals;
      const comments = await Comment.createNewComment({
        user,
        postId, 
        comment,
      });
      return res.status(200).json({ comments });
    } catch (err) {
      next(err);
    }
  }
);

// fetch single comment 
router.get("/:commentId/detail", async function (req, res, next) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.fetchCommentById(commentId);
    return res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
});

//update a comment
router.patch(
  "/:commentId/edit",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsComment,
  async function (req, res, next) {
      console.log('inside patch')
    try {
        const { commentId } = req.params;
      const comment = await Comment.editComment({
        commentUpdate: req.body,
        commentId,
      });
      return res.status(200).json({ comment });
    } catch (err) {
      next(err);
    }
  }
);





// delete a specfic comment with an id
router.delete(
  "/:commentId/delete",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsComment,
  async function (req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.deleteCommentById(commentId);
      return res.status(200).json({ message: "comment deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
