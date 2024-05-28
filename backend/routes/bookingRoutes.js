// routes/bookingRoutes.js
const express = require('express');
const Booking = require('../models/Booking');
const TrainCentre = require('../models/TraningCentre');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { trainingCentreId, date, time, seat } = req.body;
    const user = req.user.userId;

    const trainingCentre = await TrainCentre.findById(trainingCentreId);
    if (!trainingCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }

    const newBooking = new Booking({
      user,
      trainingCentre: trainingCentreId,
      date,
      time,
      seat,
    });

    await newBooking.save();
    res.status(201).json({ booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bookings for a user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('trainingCentre');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this booking' });
    }

    await booking.remove();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
