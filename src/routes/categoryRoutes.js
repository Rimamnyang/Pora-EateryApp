const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, adminOnly } = require("../middleware/auth");
const { createCategoryValidation, updateCategoryValidation } = require("../validators/categoryValidators");
const validateRequest = require("../middleware/validateRequest");

// Public routes
router.get("/", getCategories);

// Admin-only routes
router.post("/", protect, adminOnly, createCategoryValidation, validateRequest, createCategory);
router.put("/:id", protect, adminOnly, updateCategoryValidation, validateRequest, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
