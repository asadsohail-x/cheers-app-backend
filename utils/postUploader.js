import multer, { diskStorage, MulterError } from "multer";
import { v4 as generateId } from "uuid";
import { extname } from "path";

const storage = diskStorage({
  destination: "./uploads/posts",
  filename: (_, file, cb) => {
    cb(null, generateId() + "_" + Date.now() + extname(file.originalname));
  },
});

const fileFilter = (_, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/mkv",
    "video/flv",
    "video/wmv",
    "video/ogg",
    "video/svg",
    "video/avchd",
    "video/f4v",
    "video/swf",
    "video/webm",
    "video/mpeg-2",
  ];

  if (!allowedTypes.includes(file.mimetype))
    cb(new Error("File Format not supported"), false);
  cb(null, true);
};

const uploader = multer({ storage, fileFilter });

export default (fieldName, maxCount, req, res, next) => {
  const upload = uploader.array(fieldName, maxCount);

  upload(req, res, (e) => {
    try {
      if (e instanceof multer.MulterError) {
        throw e;
      } else if (e) {
        throw "Format not supported";
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  });
};
