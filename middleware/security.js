
/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError } = require("../utils/errors")

const jwtFrom = ({ headers }) => {
  if (headers?.authorization) {
    // Authorization: "Bearer asgewgewg"
    const [scheme, token] = headers.authorization.split(" ")
    if (scheme.trim() === "Bearer") {
      return token
    }
  }

  return undefined
}

/**
 * If the request contains a JWT token in the Authorization header,
 * extract that token, convert the credentials into a user, and attach
 *  it to the response's locals property.
 *
 * https://expressjs.com/en/5x/api.html#res.locals
 *
 */
const extractUserFromJwt = (req, res, next) => {
  try {
    const token = jwtFrom(req)
    if (token) {
      // if it's a valid token attach it to res.locals.user
      // anything else on the middleware chain can access the res.locals.user
      res.locals.user = jwt.verify(token, SECRET_KEY)
    }

    return next()
  } catch (err) {
    return next()
  }
}

/**
 * Ensure that a verified user is logged in.
 *
 * If not throw an UnauthorizedError
 *
 *
 */
const requireAuthenticatedUser = (req, res, next) => {
  try {
    const { user } = res.locals
    if (!user?.email) throw new UnauthorizedError()
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  jwtFrom,
  extractUserFromJwt,
  requireAuthenticatedUser,
}
