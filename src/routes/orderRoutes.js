const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/auth");
const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require("../validators/orderValidators");
const validateRequest = require("../middleware/validateRequest");

// IMPORTANT: /my-orders must be defined BEFORE /:id, otherwise Express
// would treat "my-orders" as an :id value and never reach this route.
router.get("/my-orders", protect, getMyOrders);

router.post("/", protect, createOrderValidation, validateRequest, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatusValidation,
  validateRequest,
  updateOrderStatus
);

module.exports = router;
