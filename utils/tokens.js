const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

const generateToken = (data) => jwt.sign(data, SECRET_KEY)
// possible to add expiresIn: 24hr

const createUserJwt = (creds) => {

  const payload = {
    id: creds.id,
    email: creds.email,
    username: creds.username,
    // isAdmin: creds.isAdmin || false,
  }

  return generateToken(payload)
}

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded
  } catch (err) {
    return {}
  }
}

module.exports = {
  generateToken,
  validateToken,
  createUserJwt,
}
