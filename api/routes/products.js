const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// model
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then((docs) => {
      if (docs.length === 0) {
        return res.status(200).json({
          message: 'No products in the database',
        });
      }
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            ...doc._doc,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log('error: ', err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:productId', (req, res, next) => {
  const { productId: id } = req.params;

  Product.findById(id)
    .select('-__v')
    .exec()
    .then((doc) => {
      if (doc) {
        const response = {
          product: { ...doc._doc },
          request: {
            type: 'GET',
            // description: 'Get all products',
            url: `http://localhost:3000/products`,
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

router.patch('/:productId', (req, res, next) => {
  const { productId: id } = req.params;
  const updateOperations = {};
  for (const ops of req.body) {
    updateOperations[ops.propName] = ops.value;
  }
  Product.update(
    {
      _id: id,
    },
    {
      $set: updateOperations,
    }
  )
    .exec()
    .then((doc) => {
      console.log('document: ', doc);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'PATCH',
          url: `http://localhost:3000/products/${id}`,
        },
      });
    })
    .catch((err) => {
      console.log('error: ', err);
      res.status(500).json(err);
    });
});

router.delete('/:productId', (req, res, next) => {
  const { productId: id } = req.params;
  Product.deleteOne({
    _id: id,
  })
    .exec()
    .then((doc) => {
      console.log('document: ', doc);
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: `http://localhost:3000/products`,
          body: {
            name: 'String',
            price: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  const { name, price } = req.body;

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
  });

  product
    .save()
    .then((doc) => {
      console.log('document: ', doc);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'POST',
            url: `http://localhost:3000/products/${doc._id}`,
          },
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
