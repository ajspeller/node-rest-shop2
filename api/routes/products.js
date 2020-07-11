const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET request to /products',
  });
});

router.get('/:productId', (req, res, next) => {
  const { productId: id } = req.params;

  if (id === 'special') {
    res.status(200).json({
      message: 'You discovered the special id',
      id,
    });
  } else {
    res.status(200).json({
      message: 'you passed an id',
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'updated product!',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(204).json({
    message: 'deleted product!',
  });
});

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling POST request to /products',
  });
});

module.exports = router;
