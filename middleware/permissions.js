const Post = require("../models/posts")
// const Posts = require("../models/posts")
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
        console.log('i made it past taht statement')
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
        console.log('i made it past taht statement')
        res.locals.post = post 
        return next()
    } catch(err) {
        return next(err)
    }
}

module.exports = {
    authUserOwnsPost,
    authUserIsNotPostOwner
}