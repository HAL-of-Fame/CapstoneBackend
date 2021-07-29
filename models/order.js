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
    const orderResult = await db.query(
      `
      INSERT INTO orders (customer_id) 
      VALUES ((SELECT id FROM users WHERE email = $1))
      RETURNING id
    `,
      [user.email]
    );
    // console.log(orderResult);
    // console.log(typeof orderResult.rows[0].id);
    // get orderId
    const orderId = orderResult.rows[0].id;
    // console.log("orderid", orderId);
    // add the products to the order details table
    order.forEach(async (product) => {
      const productId = product.id;
      const name = product.name;
      const price = product.price;
      const image = product.image;
      const list = await db.query(
        `
        SELECT id FROM products
      `
      );
      //use list.rows[] and do a for loop to check if each element in the list is equal to the product id
      console.log("list lenght", list.rows.length);
      console.log("list", list.rows);
      console.log("resulkt0", list);
      let found = false;
      for (let i = 0; i < list.rows.length; i++) {
        if (list.rows[i].id === productId) {
          found = true;
          break;
        }
      }
      if (found === false) {
        await db.query(
          `INSERT INTO products (id, name, image, price)
            VALUES ($1, $2, $3, $4)
            RETURNING (id, name, image, price)`,
          [productId, name, image, price]
        );
      }
    });

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
