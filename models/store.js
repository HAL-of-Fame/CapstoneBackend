const db = require("../db")

class Store {
  //returns all products in the database
  static async listProducts() {
    const result = await db.query(`
    SELECT *
    FROM products;`)

    return result.rows
  }
}

module.exports = Store