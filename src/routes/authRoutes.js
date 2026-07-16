const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);

module.exports = router;
