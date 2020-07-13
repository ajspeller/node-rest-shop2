const express = require('express');
const router = express.Router();

const { users } = require('../controllers/users');

router.post('/signup', users.users_signup);

router.post('/login', users.users_login);

router.delete('/:userId', );

module.exports = router;
