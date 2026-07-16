const Category = require("../models/Category");
const Menu = require("../models/Menu");

/**
 * GET /api/categories
 * Public - list all categories, sorted alphabetically.
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 * Admin only - create a new category.
 * Mongoose's unique index on `name` handles duplicates at the DB level;
 * the centralized errorHandler in middleware/errorHandler.js catches the
 * code-11000 duplicate-key error and returns a 400 automatically.
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/categories/:id
 * Admin only - update a category's name or description.
 */
const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/categories/:id
 * Admin only - delete a category.
 * Rejected if any Menu item still references this category, to prevent
 * orphaned menu items with a null/broken category reference.
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Safety check: block deletion if menu items currently use this category
    const menuItemCount = await Menu.countDocuments({ category: req.params.id });
    if (menuItemCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${menuItemCount} menu item${menuItemCount > 1 ? "s" : ""} currently use this category. Reassign or delete those items first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
