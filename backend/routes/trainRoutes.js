const express = require('express');
const TrainCentre = require('../models/TrainingCentre');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new training center
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create training centres' });
    }
    const { name, location, capacity, contactInfo, availableSeats, date, time, price } = req.body;
    const createdBy = req.user.userId;
    if (!name || !location || !capacity || !contactInfo || availableSeats == null || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newTrainCentre = new TrainCentre({
      name,
      location,
      capacity,
      contactInfo,
      availableSeats,
      date,
      time,
      createdBy,
      price,
    });
    await newTrainCentre.save();
    res.status(201).json({ trainCentre: newTrainCentre });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all training centers
router.get('/', async (req, res) => {
  try {
    const trainCentres = await TrainCentre.find();
    res.json({ trainCentres });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific training center by ID
router.get('/:id', async (req, res) => {
  try {
    const trainCentre = await TrainCentre.findById(req.params.id);
    if (!trainCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }
    res.json({ trainCentre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search training center by name
router.post('/search', async (req, res) => {
  try {
    const { name } = req.body;
    const trainCentre = await TrainCentre.findOne({ name });
    if (!trainCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }
    res.json({ trainCentre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a training center by ID
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update training centres' });
    }
    const { name, location, capacity, contactInfo, availableSeats, date, time, price } = req.body;
    const updatedTrainCentre = await TrainCentre.findByIdAndUpdate(req.params.id, {
      name,
      location,
      capacity,
      contactInfo,
      availableSeats,
      date,
      time,
      price,
    }, { new: true });
    if (!updatedTrainCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }
    res.json({ trainCentre: updatedTrainCentre });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a training center by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete training centres' });
    }
    const deletedTrainCentre = await TrainCentre.findByIdAndDelete(req.params.id);
    if (!deletedTrainCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }
    res.json({ message: 'Training centre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
