const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../controllers/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "corusel",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({ storage });
