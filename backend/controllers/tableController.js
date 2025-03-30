const Table = require('../models/Table');

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({}).populate('currentOrder');
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error: error.message });
  }
};

// Get a single table
exports.getTable = async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.number }).populate('currentOrder');
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table', error: error.message });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    
    // Check if table already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: 'Table with this number already exists' });
    }
    
    const newTable = new Table({
      tableNumber,
      capacity,
      isOccupied: false
    });
    
    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(400).json({ message: 'Error creating table', error: error.message });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  try {
    const { isOccupied } = req.body;
    
    const updatedTable = await Table.findOneAndUpdate(
      { tableNumber: req.params.number },
      { isOccupied },
      { new: true, runValidators: true }
    );
    
    if (!updatedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(400).json({ message: 'Error updating table status', error: error.message });
  }
};
