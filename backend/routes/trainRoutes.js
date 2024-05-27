// routes/trainCentreRoute.js

const express = require('express');
const TrainCentre = require('../models/TraningCentre');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role == 'admin') {
      return res.status(403).json({ message: 'Only admin can create training centres' });
    }

    const { name, location, capacity, contactInfo } = req.body;
    const createdBy = req.user.userId;

    // Check if all required fields are provided
    if (!name || !location || !capacity || !contactInfo) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTrainCentre = new TrainCentre({
      name,
      location,
      capacity,
      contactInfo,
      createdBy,
    });

    await newTrainCentre.save();

    res.status(201).json({ trainCentre: newTrainCentre });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
});

// Get all training centres
router.get('/', async (req, res) => {
  try {
    const trainCentres = await TrainCentre.find();
    res.json({ trainCentres });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific training centre by ID
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

// Define the POST method for searching training centers by name
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
  
  
// Update a training centre by ID
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role == 'admin') {
      return res.status(403).json({ message: 'Only admin can update training centres' });
    }

    const { name, location, capacity } = req.body;

    const updatedTrainCentre = await TrainCentre.findByIdAndUpdate(req.params.id, {
      name,
      location,
      capacity,
    }, { new: true });

    if (!updatedTrainCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }

    res.json({ trainCentre: updatedTrainCentre });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a training centre by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role == 'admin') {
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
