const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log('documents: ', docs);
      if (docs.length === 0) {
        return res.status(200).json({
          message: 'No products in the database',
        });
      }
      return res.status(200).json(docs);
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
    .exec()
    .then((doc) => {
      console.log('document: ', doc);
      if (doc) {
        return res.status(200).json(doc);
      }
      return res.status(404).json({
        message: 'No entry for the provided ID',
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
      res.status(200).json(doc);
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
      res.status(204).json(doc);
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
    .then((result) => {
      console.log('result: ', result);
      res.status(201).json({
        message: 'handling POST request to /products',
        createdProduct: product,
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
