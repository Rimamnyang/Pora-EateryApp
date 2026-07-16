const { body } = require("express-validator");

const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.menuItem").isMongoId().withMessage("Each item needs a valid menuItem id"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Each item quantity must be at least 1"),
  body("deliveryAddress").trim().notEmpty().withMessage("Delivery address is required"),
];

const updateOrderStatusValidation = [
  body("status")
    .isIn(["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"])
    .withMessage("Invalid order status"),
];

module.exports = { createOrderValidation, updateOrderStatusValidation };
