const express = require("express");
const router = express.Router();

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { menuValidation, menuUpdateValidation } = require("../validators/menuValidators");
const validateRequest = require("../middleware/validateRequest");

// Public routes
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

// Admin-only routes
// upload.single("image") runs before validators so multer can parse the
// multipart/form-data body and populate req.body for the validator rules.
router.post("/", protect, adminOnly, upload.single("image"), menuValidation, validateRequest, createMenuItem);
router.put("/:id", protect, adminOnly, upload.single("image"), menuUpdateValidation, validateRequest, updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;
