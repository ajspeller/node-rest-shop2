const express = require('express');
const router = express.Router();

const { products } = require('../controllers/products');

// middleware
const checkAuth = require('../middleware/check-auth');

// setup image upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    // accept
    cb(null, true);
  } else {
    // reject
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get('/', products.products_get_all);

router.get('/:productId', products.products_get);

router.patch('/:productId', checkAuth, products.products_patch);

router.delete('/:productId', checkAuth, products.products_delete);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  products.products_post
);

module.exports = router;
