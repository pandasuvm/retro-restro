const Order = require('../models/Order');
const Table = require('../models/Table');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get orders by table number
exports.getOrdersByTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const orders = await Order.find({ tableNumber })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get a single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    // Handle CastError for invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};


// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items, totalAmount, paymentMethod } = req.body;
    
    // Check if table exists and is available
    const table = await Table.findOne({ tableNumber });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    if (table.isOccupied && !table.currentOrder) {
      return res.status(400).json({ message: 'Table is occupied but has no active order' });
    }
    
    // Create new order
    const newOrder = new Order({
      tableNumber,
      items,
      totalAmount,
      paymentMethod,
      status: 'Pending'
    });
    
    const savedOrder = await newOrder.save();
    
    // Update table status
    table.isOccupied = true;
    table.currentOrder = savedOrder._id;
    await table.save();
    
    // Populate the menu items for response
    const populatedOrder = await Order.findById(savedOrder._id).populate('items.menuItem');
    
    // Emit socket event for real-time updates
    req.io.to('restaurant').emit('new_order', populatedOrder);
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Preparing', 'Ready', 'Served', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.menuItem');
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If order is completed, update table status
    if (status === 'Completed') {
      await Table.findOneAndUpdate(
        { tableNumber: updatedOrder.tableNumber },
        { isOccupied: false, currentOrder: null }
      );
    }
    
    // Emit socket event for real-time updates
    req.io.to('restaurant').emit('status_update', updatedOrder);
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentMethod },
      { new: true, runValidators: true }
    ).populate('items.menuItem');
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating payment status', error: error.message });
  }
};
