const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{ 
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: { type: Number, required: true }
    }],
    tableNumber: { type: Number },
    status: { 
      type: String, 
      enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Completed'],
      default: 'Pending'
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'] },
    paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Order', orderSchema);
