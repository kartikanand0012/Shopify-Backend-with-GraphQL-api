const controller = require("../controller");

const router = require("express").Router();


router.post("/get-order",controller.admin.getOrder);
router.post("/get-product",controller.admin.getAllProduct);


module.exports= router