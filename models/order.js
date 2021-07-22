const { BadRequestError } = require("../utils/errors");
const db = require("../db");

class Order {
  //returns all the orders that the user has created
  static async listOrdersForUser(user) {
    const query = `
      SELECT orders.id AS "orderId",
             orders.customer_id AS "customerId",
             od.quantity AS "quantity",
             products.name AS "name",
             products.price AS "price"
      FROM orders
        JOIN order_details AS od ON od.order_id = orders.id
        JOIN products ON products.id = od.product_id
      WHERE orders.customer_id = (SELECT id FROM users WHERE email = $1)
    `;
    const result = await db.query(query, [user.email]);

    return result.rows;
  }

  //take a users order and store it in the database
  static async createOrder({ order, user }) {
    if (!order || !Object.keys(order).length) {
      throw new BadRequestError("No order info provided");
    }
    if (!user) {
      throw new BadRequestError("No user provided");
    }
    console.log(order);
    // create a new order
    // const customId = await db.query(
    //   `

    //   `
    // )
    const orderResult = await db.query(
      `
      INSERT INTO orders (customer_id) 
      VALUES ((SELECT id FROM users WHERE email = $1))
      RETURNING id
    `,
      [user.email]
    );
    console.log(orderResult);
    console.log(typeof orderResult.rows[0].id);
    // get orderId
    // const orderid = await db.query(
    //   `
    //   SELECT id
    //   FROM orders
    //   WHERE customer_id = (SELECT id FROM users WHERE email = $1)
    //   `,
    //   [user.email]
    // );
    // console.log(orderid);
    const orderId = orderResult.rows[0].id;
    console.log("orderid", orderId);
    // add the products to the order details table
    order.forEach(async (product) => {
      const productId = product.id;
      const quantity = product.quantity;

      await db.query(
        `
        INSERT INTO order_details (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
      `,
        [orderId, productId, quantity]
      );
    });

    return await Order.fetchOrderById(orderId);
  }

  static async fetchOrderById(orderId) {
    const result = await db.query(
      `
      SELECT orders.id AS "orderId",
             orders.customer_id AS "customerId",
             od.quantity AS "quantity",
             products.name AS "name",
             products.price AS "price"
      FROM orders
        JOIN order_details AS od ON od.order_id = orders.id
        JOIN products ON products.id = od.product_id
      WHERE orders.id = $1
    `,
      [orderId]
    );

    return result.rows;
  }
}

module.exports = Order;
