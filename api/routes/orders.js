const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// models
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order.find()
    .select('-__v')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      console.log('documents: ', docs);
      return res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${doc._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log('error: ', err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.get('/:orderId', (req, res, next) => {
  const { orderId: id } = req.params;
  Order.findById(id)
    .select('-__v')
    .populate('product', '-__v')
    .exec()
    .then((order) => {
      console.log('order: ', order);
      if (order) {
        const response = {
          order,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders`,
          },
        };
        return res.status(200).json(response);
      }
      return res.status(404).json({
        message: 'No data for the provided ID',
      });
    })
    .catch((err) => {
      console.log('error: ', err);
      res.status(500).json({
        error: err,
      });
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
  Order.deleteOne({
    _id: id,
  })
    .exec()
    .then((doc) => {
      console.log('document: ', doc);
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: `http://localhost:3000/orders`,
          body: {
            productId: 'Id of Product',
            quantity: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      console.log('error: ', err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  const { productId, quantity } = req.body;

  Product.findById(productId)
    .exec()
    .then((productFound) => {
      if (!productFound) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity,
        product: productId,
      });

      console.log('productFound: ', productFound);
      return order.save();
    })
    .then((doc) => {
      console.log('document: ', doc);
      res.status(201).json({
        message: 'Order created successfully',
        createOrder: {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${doc._id}`,
        },
      });
    })
    .catch((err) => {
      console.log('error: ', err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
