const cloudinary = require("cloudinary").v2;

/**
 * Configures the Cloudinary SDK using credentials from .env.
 * Called once when this module is first required.
 * All uploads via the multer-storage-cloudinary middleware
 * use this configuration automatically.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
