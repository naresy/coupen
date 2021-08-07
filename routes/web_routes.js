const router = require("express").Router();
const WebControllers = require("../controllers/web_controllers");

router.get("/:asin&:coupon", WebControllers.verifyCoupon);

module.exports = {
    router,
}