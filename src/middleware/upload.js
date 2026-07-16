const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * Multer storage engine that streams uploaded files directly to Cloudinary.
 * No file is ever written to disk — the image goes straight from the request
 * to Cloudinary's servers, and Cloudinary returns a URL.
 *
 * Configuration:
 *   folder      - all menu images are grouped under "eatery-menu" in Cloudinary
 *   allowed_formats - restricts uploads to common web image types
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eatery-menu",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Cloudinary auto-generates a unique public_id for each upload
  },
});

/**
 * Multer middleware configured to accept a single file under the field name "image".
 * Usage in a route: upload.single("image")
 * After it runs, req.file.path holds the Cloudinary CDN URL of the uploaded image.
 */
const upload = multer({ storage });

module.exports = upload;
