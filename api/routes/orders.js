const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET request to /orders',
  });
});

router.get('/:orderId', (req, res, next) => {
  const { orderId: id } = req.params;

  res.status(200).json({
    message: 'order details',
    id,
  });
});

router.patch('/:orderId', (req, res, next) => {
  const { orderId: id } = req.params;

  res.status(200).json({
    message: 'order get route',
    id,
  });
});

router.delete('/:orderId', (req, res, next) => {
  const { orderId: id } = req.params;

  res.status(204).json({
    message: 'order deleted',
    id,
  });
});

router.post('/', (req, res, next) => {
  const { productId, quantity } = req.body;
  const order = {
    productId,
    quantity,
  };

  res.status(201).json({
    message: 'handling POST request to /orders',
    createdOrder: order,
  });
});

module.exports = router;
