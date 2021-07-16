const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require("./config")
const { BadRequestError, NotFoundError } = require("./utils/errors")
const authRoutes = require("./routes/auth")
const storeRoutes = require("./routes/store")
const orderRoutes = require("./routes/order")

const app = express()
const security = require("./middleware/security")


app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(security.extractUserFromJwt)
// for every request, 
// check if a user/token exists in the authorization header
// if it does, attach the decoded user to res.locals

app.use("/auth", authRoutes)
app.use("/store", storeRoutes)
app.use("/order", orderRoutes)

// if endpoint doesn't exist then will send to NotFoundError. Handles 404 errors
// basically it tries going through /auth and then /exercise. if None of those work
// Then it goes through this NotFoundError
app.use((req,res,next) => {
    return next(new NotFoundError)
})

// if anything has reached this point, an error is involved
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message 

    return res.status(status).json({
        error: { message, status }
    })
})

// const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})