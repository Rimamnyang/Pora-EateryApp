const { body } = require("express-validator");

const createCategoryValidation = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").optional().trim(),
];

// For updates, name is optional but must not be blank if provided
const updateCategoryValidation = [
  body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
  body("description").optional().trim(),
];

module.exports = { createCategoryValidation, updateCategoryValidation };
