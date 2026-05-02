const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Use memory storage to process images before saving
const storage = multer.memoryStorage();

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only images (jpeg, jpg, png, webp) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB to handle high-res originals before compression
  fileFilter: fileFilter
});

// Optimization Middleware
upload.optimize = async (req, res, next) => {
  if (!req.file && (!req.files || req.files.length === 0)) return next();

  try {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const processFile = async (file) => {
      const filename = `rdps-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.buffer)
        .resize({ 
          width: 1920, 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Update file object to reflect processed file
      file.filename = filename;
      file.path = outputPath;
      file.mimetype = 'image/webp';
    };

    if (req.file) {
      await processFile(req.file);
    } else if (req.files) {
      await Promise.all(req.files.map(file => processFile(file)));
    }

    next();
  } catch (error) {
    console.error('Image optimization error:', error);
    next(error);
  }
};

module.exports = upload;
