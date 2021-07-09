const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
    // to return a user without the pw showing
    static async makePublicUser(user) {
        return {
            id: user.id, 
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
        }
    }

  static async login(credentials) {
    // user should submit email and pw
    const requiredFields = ["email", "password"];
    // if any fields are missing, throw an error
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    // lookup user in db by email
    const user = await User.fetchUserByEmail(credentials.email);
    // if user is found, compare submitted pw with pw in db
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      // will compare the submitted pw with the hashed pw in the db
      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    // if any of this goes wrong, throw an error
    throw new UnauthorizedError("Invalid email/pw combo");
  }

  static async register(credentials) {
    // if any field missing, throw an error
    const requiredFields = [
      "email",
      "password",
      "username",
      "first_name",
      "last_name",
    ];
    // checks to see if these values exist, if all the info was sent
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    // check to see if the user already exist in db, if so throw an error
    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(
        `A user already exists with this email: ${credentials.email}`
      );
    }

    // take the user pw and hash it
    const hashedPW = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );
    // take the email and lowercase it
    const lowercasedEmail = credentials.email.toLowerCase();

    // create a new user in the db with all their info
    const result = await db.query(
      `
            INSERT INTO users (
                email,
                password,
                username,
                first_name,
                last_name
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, password, username, first_name, last_name;
        `,
      [
        lowercasedEmail,
        hashedPW,
        credentials.username,
        credentials.first_name,
        credentials.last_name,
      ]
      // this stuff in the array is what gets inserted into the users
      // email = lowercasedEmail, password = hashedPW
    );

    // return the user
    const user = result.rows[0];
    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email.toLowerCase()]); //[email.toLowerCase()] will be substituted for $1
    const user = result.rows[0]; //pg will return an array so get first object
    return user;
  }
}

module.exports = User;
