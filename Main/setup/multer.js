const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "assets/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.filename));
  },
});

const fileFilter = (req, file, cb) => {
  const fileEnum = ["image/png", "image/jpeg", "image/jpg", "image/tiff"];

  if (!fileEnum.includes(file.mimetype)) {
    cb(new Error("Invalid file type!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 mb
  fileFilter,
});

module.exports.upload = upload.single("image");
