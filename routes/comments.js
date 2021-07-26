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

// fetch single comment 
router.get("/:postId/detail", async function (req, res, next) {
  try {
    const { postId } = req.params;
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
  "/:postId/edit",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsComment,
  async function (req, res, next) {
      console.log('inside patch')
    try {
        const { postId } = req.params;
        console.log(postId)
      const comment = await Comment.editComment({
        commentUpdate: req.body,
        postId,
      });
      return res.status(200).json({ comment });
    } catch (err) {
      next(err);
    }
  }
);


// fetch all comments at that postId - DONE
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



// delete a specfic comment with an id
router.delete(
  "/:postId/detail/delete",
  security.requireAuthenticatedUser,
  permissions.authUserOwnsComment,
  async function (req, res, next) {
    try {
      const { postId } = req.params;
      const comment = await Comment.deleteCommentById(postId);
      return res.status(200).json({ message: "comment deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
