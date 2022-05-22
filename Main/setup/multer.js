const multer = require("multer");

const ApiError = require("../exceptions/api.error");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./public/images");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (_req, file, cb) => {
  const fileEnum = ["image/png", "image/jpg", "image/jpeg"];

  if (!fileEnum.includes(file.mimetype)) {
    return cb(ApiError.BadRequest("Invalid file type!"), false);
  }

  return cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports.upload = upload.single("image");
