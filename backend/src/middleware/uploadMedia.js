const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `galerie-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = /^image\/(jpeg|png|gif|webp)$/.test(file.mimetype);
  const isVideo = /^video\/(mp4|webm|ogg|quicktime)$/.test(file.mimetype);
  if (isImage || isVideo) cb(null, true);
  else cb(new Error("Seules les images et videos sont acceptees"));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
