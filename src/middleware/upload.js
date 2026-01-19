const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary");

const CloudinaryStorage =
  multerStorageCloudinary.CloudinaryStorage ||
  multerStorageCloudinary.default ||
  multerStorageCloudinary;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "corusel",
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({ storage });

// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../controllers/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "corusel",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });

// module.exports = multer({ storage });
