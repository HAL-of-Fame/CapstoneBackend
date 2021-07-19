const Post = require("../models/posts")
// const Posts = require("../models/posts")
const { BadRequestError, ForbiddenError } = require("../utils/errors")

// ensure authentiticated user is owner of post 
// if not then throw an error
// otherwise we're good 

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

module.exports = {
    authUserOwnsPost
}