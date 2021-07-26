const Post = require("../models/posts")
const Comment = require("../models/comments")
const { BadRequestError, ForbiddenError } = require("../utils/errors")

// ensure authentiticated user is owner of post 
const authUserOwnsPost = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { postId } = req.params
        const post = await Post.fetchPostById(postId)
        console.log(post.userEmail)
        console.log(user.username)
        if (post.userEmail !== user.email) {
            throw new ForbiddenError(`${user.username} is not allowed to update ${post.userName}'s posts`)
        }
        res.locals.post = post 
        return next()
    } catch(err) {
        return next(err)
    }
}


// ensures that the user can't work/edit their own post
const authUserIsNotPostOwner = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { postId } = req.params
        const post = await Post.fetchPostById(postId)
        if (post.userEmail == user.email) {
            throw new BadRequestError(`Users are not allowed to rate their own posts`)
        }
        res.locals.post = post 
        return next()
    } catch(err) {
        return next(err)
    }
}


// ensure authentiticated user is owner of comment 
const authUserOwnsComment = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { postId } = req.params
        console.log("user", user)
        console.log(postId)
        const comment = await Comment.fetchCommentById(postId)
        console.log('comment', comment)
        if (comment.userEmail !== user.email) {
            throw new ForbiddenError(`${user.username} is not allowed to update ${comment.userName}'s posts`)
        }
        console.log('res.locals', res.locals)
        res.locals.comment = comment
        return next()
    } catch(err) {
        return next(err)
    }
}


// ensures that the user can't work/edit their own post
const authUserIsNotCommentOwner = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { postId } = req.params
        const comment = await Comment.fetchCommentById(postId)
 
        if (post.userEmail == user.email) {
            throw new BadRequestError(`Users are not allowed to rate their own posts`)
        }
        res.locals.comment = comment
        return next()
    } catch(err) {
        return next(err)
    }
}

module.exports = {
    authUserOwnsPost,
    authUserIsNotPostOwner,
    authUserOwnsComment,
    authUserIsNotCommentOwner
}