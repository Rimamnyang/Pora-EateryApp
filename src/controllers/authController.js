const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * POST /api/auth/signup
 * Public - creates a new customer account.
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // role is intentionally NOT taken from req.body - signup always creates customers.
    // Admins are created via the seed script or by an existing admin, never by public signup.
    const user = await User.create({ name, email, password, phone });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Public - authenticates a user and returns a JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password has `select: false` on the schema, so we explicitly request it here
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };
