const Menu = require("../models/Menu");
const Category = require("../models/Category");

/**
 * GET /api/menu
 * Public - lists menu items. Supports query params:
 *   ?search=name text search
 *   ?category=<CategoryObjectId>
 *   ?minPrice=1000&maxPrice=5000
 */
const getMenuItems = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      // category is now an ObjectId — pass it directly as the filter value.
      // Mongoose will cast the string to ObjectId automatically.
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const menuItems = await Menu.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/menu/:id
 * Public - single meal detail.
 */
const getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await Menu.findById(req.params.id).populate("category", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/menu
 * Admin only.
 * Verifies the submitted category id refers to a real Category document
 * before creating the menu item.
 */
const createMenuItem = async (req, res, next) => {
  try {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found — create the category first via POST /api/categories",
      });
    }

    // If an image file was uploaded, Multer+Cloudinary puts its CDN URL on req.file.path
    if (req.file) {
      req.body.imageUrl = req.file.path;
    }

    const menuItem = await Menu.create(req.body);

    // Populate so the response immediately shows the category name
    await menuItem.populate("category", "name");

    res.status(201).json({
      success: true,
      message: "Menu item created",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/menu/:id
 * Admin only.
 * If a new category id is supplied, verifies it exists first.
 */
const updateMenuItem = async (req, res, next) => {
  try {
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found — use a valid Category id",
        });
      }
    }

    // Only overwrite imageUrl if the admin uploaded a new image.
    // If no file is sent, the existing imageUrl in the DB is preserved.
    if (req.file) {
      req.body.imageUrl = req.file.path;
    }

    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    }).populate("category", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/menu/:id
 * Admin only.
 */
const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
