const { Client } = require("pg") // handles most of all these functions
const { getDatabaseUri } = require("./config")
require("colors")

// instantiate a new instance of client. passing a single key (connectionString) holding the database URI
const db = new Client({ connectionString: getDatabaseUri() })

// will log info to the screen
db.connect((err) => {
    if (err) {
        console.error("connection error".red, err.stack)
    } else {
        console.log("Successfully connected to postgres db!".blue)
    }
})

module.exports = db