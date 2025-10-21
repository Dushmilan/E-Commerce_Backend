const mutler = require('multer');
const path = require('path');
// Set up storage engine
const storage = mutler.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded photos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
};
// Initialize multer with storage engine and file filter
const upload = mutler({
  storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
}).single('photo'); // Expecting a single file with field name 'photo'
// Middleware function to handle photo upload
function photoUpload(req, res, next) {
    upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    next();
  });
}
module.exports = photoUpload;