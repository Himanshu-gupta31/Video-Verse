import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the directory exists
const tempDir = path.join(__dirname, "public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can use a unique filename here if needed
  }
});

export const upload = multer({ storage });
