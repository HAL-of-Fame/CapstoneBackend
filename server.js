const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require("./config")
const { BadRequestError, NotFoundError } = require("./utils/errors")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/order")
const security = require("./middleware/security")



const app = express()


app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(security.extractUserFromJwt) //responsible for tokens


app.use("/auth", authRoutes)
app.use("/orders", orderRoutes)

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