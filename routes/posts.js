/** Routes for authentication. */

const express = require("express")

const router = express.Router()
const security = require("../middleware/security") // for middleware
const { createUserJwt } = require("../utils/tokens") // to generate JWT tokens



router.post("/", async function (req, res, next) {
  try {
      // create a new post
    const user = await User.login(req.body)
    const token = createUserJwt(user)
    // const user = await User.authenticate(req.body)
    return res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
})

router.get("/", async function (req, res, next) {
    try {
        // fetch all posts
      const user = await User.login(req.body)
      const token = createUserJwt(user)
      // const user = await User.authenticate(req.body)
      return res.status(200).json({ user, token })
    } catch (err) {
      next(err)
    }
  })

  router.get("/:postId", async function (req, res, next) {
    try {
        // fetch single post
      const user = await User.login(req.body)
      const token = createUserJwt(user)
      // const user = await User.authenticate(req.body)
      return res.status(200).json({ user, token })
    } catch (err) {
      next(err)
    }
  })

  router.put("/:postId", async function (req, res, next) {
    try {
        // uodate a post 
      const user = await User.login(req.body)
      const token = createUserJwt(user)
      // const user = await User.authenticate(req.body)
      return res.status(200).json({ user, token })
    } catch (err) {
      next(err)
    }
  })


  router.post("/:postId/ratings", async function (req, res, next) {
    try {
        // create a rating for a post
      const user = await User.login(req.body)
      const token = createUserJwt(user)
      // const user = await User.authenticate(req.body)
      return res.status(200).json({ user, token })
    } catch (err) {
      next(err)
    }
  })
module.exports = router
