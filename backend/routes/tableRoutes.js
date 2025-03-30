const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Get all tables
router.get('/', tableController.getAllTables);

// Get a single table
router.get('/:number', tableController.getTable);

// Create a new table
router.post('/', tableController.createTable);

// Update table status
router.put('/:number', tableController.updateTableStatus);

module.exports = router;
