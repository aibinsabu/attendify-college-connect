
const express = require('express');
const router = express.Router();
const BusRoute = require('../models/BusRoute');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await BusRoute.find({ active: true });
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching bus routes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update route
router.put('/:id', async (req, res) => {
  try {
    const updatedRoute = await BusRoute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Bus route not found' });
    }
    
    res.status(200).json(updatedRoute);
  } catch (error) {
    console.error('Error updating bus route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new route
router.post('/', async (req, res) => {
  try {
    const newRoute = new BusRoute(req.body);
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating bus route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
