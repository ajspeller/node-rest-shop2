const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  const saltRounds = 10;
  const { email, password } = req.body;
  User.find({
    email,
  })
    .exec()
    .then((user) => {
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
                return res.status(201).json({
                  message: 'User Created',
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

router.post('/login', (req, res, next) => {
  const { email, password: passwordPlain } = req.body;
  User.find({
    email,
  })
    .exec()
    .then((users) => {
      if (users.length) {
        const { _id: userId, password: passwordHash } = users[0];
        bcrypt.compare(passwordPlain, passwordHash, (err, result) => {
          if (err || !result) {
            return res.status(401).json({
              message: 'Authentication failed',
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email,
                userId,
              },
              process.env.JWT_KEY,
              {
                expiresIn: '1h',
              }
            );
            return res.status(200).json({
              message: 'Authentication successful',
              token,
            });
          }
        });
      } else {
        return res.status(401).json({
          message: 'Authentication failed',
        });
      }
    })
    .catch((err) => {
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
    .then(() => {
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
