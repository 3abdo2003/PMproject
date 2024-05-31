const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const Cart = require('../models/Cart');
const TrainCentre = require('../models/TrainingCentre'); // Corrected the import
const Booking = require('../models/Booking'); // Ensure Booking is imported
const auth = require('../middleware/auth');
const router = express.Router();

// Add an item to the cart
router.post('/', auth, async (req, res) => {
  try {
    const { trainingCentreId, date, time, seat } = req.body;
    const user = req.user.userId;

    const trainingCentre = await TrainCentre.findById(trainingCentreId);
    if (!trainingCentre) {
      return res.status(404).json({ message: 'Training centre not found' });
    }

    const cart = await Cart.findOne({ user });
    const cartItem = {
      trainingCentre: trainingCentreId,
      date,
      time,
      seat,
      price: trainingCentre.price,
    };

    if (cart) {
      cart.items.push(cartItem);
      await cart.save();
    } else {
      const newCart = new Cart({
        user,
        items: [cartItem],
      });
      await newCart.save();
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View the cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.trainingCentre');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const total = cart.items.reduce((acc, item) => acc + item.price, 0);
    res.json({ cart, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove an item from the cart
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place an order from the cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.trainingCentre');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bookings = [];
      for (const item of cart.items) {
        const trainingCentre = await TrainCentre.findById(item.trainingCentre._id).session(session);
        if (trainingCentre.availableSeats < 1) {
          throw new Error(`No available seats for ${trainingCentre.name} at the requested time.`);
        }
        trainingCentre.availableSeats -= 1;
        await trainingCentre.save({ session });

        bookings.push({
          user: req.user.userId,
          trainingCentre: item.trainingCentre._id,
          date: item.date,
          time: item.time,
          seat: item.seat,
        });
      }

      await Booking.insertMany(bookings, { session });
      await Cart.findByIdAndDelete(cart._id).session(session);

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ message: 'Order placed successfully', bookings });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
