const express = require("express");
const product_controller = require("../controllers/product_controller");
const router = express.Router();

router.get("/get_product_data", product_controller.get_product_data);

module.exports = router;
