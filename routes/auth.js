/** Routes for authentication. */

const express = require("express")
const User = require("../models/user")
const router = express.Router()
const security = require("../middleware/security") // for middleware
const { createUserJwt } = require("../utils/tokens") // to generate JWT tokens


// the security.requireAuthenticatedUser - if the token doesn't exist it'll throw an error

router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { email } = res.locals.user
    const user = await User.fetchUserByEmail(email)
    // console.log("user is", user)
    const publicUser = await User.makePublicUser(user)
    // const orders = await Order.listOrdersForUser(user)
    // console.log(publicUser)
    return res.status(200).json({ user: publicUser })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async function (req, res, next) {
  try {
    const user = await User.login(req.body)
    const token = createUserJwt(user)
    // console.log(token)
    // const user = await User.authenticate(req.body)
    return res.status(200).json({ user, token })
  } catch (err) {
    next(err)
  }
})

router.post("/register", async function (req, res, next) {
  try {
    const user = await User.register(req.body)
    const token = createUserJwt(user)
    return res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
