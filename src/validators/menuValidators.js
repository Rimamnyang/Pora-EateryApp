const { body } = require("express-validator");

const menuValidation = [
  body("name").trim().notEmpty().withMessage("Meal name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  body("category").isMongoId().withMessage("category must be a valid Category id"),
  body("isAvailable").optional().isBoolean().withMessage("isAvailable must be true or false"),
];

// For updates, allow partial payloads (PUT here behaves like a partial update)
const menuUpdateValidation = [
  body("name").optional().trim().notEmpty().withMessage("Meal name cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0"),
  body("category").optional().isMongoId().withMessage("category must be a valid Category id"),
  body("isAvailable").optional().isBoolean().withMessage("isAvailable must be true or false"),
];

module.exports = { menuValidation, menuUpdateValidation };
