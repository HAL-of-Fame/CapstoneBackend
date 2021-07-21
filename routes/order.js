const express = require("express");
const Order = require("../models/order");
const security = require("../middleware/security");
const router = express.Router();

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  //return JSON with array of orders
  try {
    const user = res.locals.user;
    const orders = await Order.listOrdersForUser(user);
    return res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  //returns json wehre new order is stored
  console.log(req);
  try {
    const user = req.body.user;
    console.log(user);
    console.log(req.body.order.id);
    const order = await Order.createOrder({ order: req.body.order, user });
    return res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
