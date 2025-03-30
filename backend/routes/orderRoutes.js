const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get orders by table
router.get('/table/:tableNumber', orderController.getOrdersByTable);

// Get a single order
router.get('/:id', orderController.getOrder);

// Create a new order
router.post('/', orderController.createOrder);

// Update order status
router.put('/:id/status', orderController.updateOrderStatus);

// Update payment status
router.put('/:id/payment', orderController.updatePaymentStatus);

module.exports = router;
