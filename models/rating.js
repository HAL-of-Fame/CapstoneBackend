const db = require("../db")


class Rating {

    static async fetchRatingForPostByUser({user, postId}) {
        // check if user has already added rating for this post 
        // and throw error
        // otherwise insert rating into the db 
    }
    



    static async createRatingForPost({rating, user, postId}) {
    // check if user has already added rating for this post 
    // and throw error
    // otherwise insert rating into the db 
}
}

module.exports = Rating