const express = require("express")
const Store = require("../models/store")
const router = express.Router()

router.get("/", async (req, res, next) => {
  //returns the list of products in a json format 
  //main endpoint for frontend to recieve all products for the store
  try {
    const products = await Store.listProducts()
    return res.status(200).json({ products })
  } catch (err) {
    next(err)
  }
})

module.exports = router