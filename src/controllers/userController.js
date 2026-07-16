const User = require("../models/User");

/**
 * GET /api/users/profile
 * Private - returns the logged-in user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user was attached by the `protect` middleware
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Private - updates the logged-in user's own profile.
 * Deliberately does NOT allow changing `role` here - that must never be
 * settable by the user themselves.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
