// routes/bookingRoutes.js
const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Get bookings by date and time for a training centre
router.get('/', async (req, res) => {
  const { trainingCentreId, date, time } = req.query;
  try {
    const bookings = await Booking.find({
      trainingCentre: trainingCentreId,
      date: new Date(date),
      time,
    });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
