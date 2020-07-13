const express = require('express');
const router = express.Router();

// middleware
const checkAuth = require('../middleware/check-auth');

// controllers
const { orders } = require('../controllers/orders');

router.get('/', checkAuth, orders.orders_get_all);

router.get('/:orderId', checkAuth, orders.orders_get);

router.patch('/:orderId', checkAuth, orders.orders_patch);

router.delete('/:orderId', checkAuth, orders.orders_delete);

router.post('/', checkAuth, orders.orders_post);

module.exports = router;
