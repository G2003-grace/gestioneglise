const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVideo = /^video\//.test(file.mimetype);
    return {
      folder: "ad-akassato/galerie",
      resource_type: isVideo ? "video" : "image",
      public_id: `galerie-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
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
