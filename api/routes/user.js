const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  const saltRounds = 10;
  const { email, password } = req.body;
  User.find({
    email,
  })
    .exec()
    .then((user) => {
      console.log('user: ', user);
      if (user.length) {
        return res.status(409).json({
          message: 'Email address is already in use',
        });
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log('result: ', result);
                return res.status(201).json({
                  message: 'User Created',
                });
              })
              .catch((err) => {
                console.log('error: ', err);
                return res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log('error: ', err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  const { userId: id } = req.params;
  User.deleteOne({
    _id: id,
  })
    .exec()
    .then((result) => {
      return res.status(200).json({
        message: 'User deleted',
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
