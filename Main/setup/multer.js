const multer = require("multer");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "assets");
  },
  file: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const limits = {
  fileSize: 10 * 1000 * 1000,
};

const fileFilter = (req, file, cb) => {
  const fileEnum = ["image/png", "image/jpg", "image/jpeg"];

  if (!fileEnum.includes(file.mimetype)) {
    cb(new Error("Invalid data type!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports.upload = upload.single("image");
