// models/Booking.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainingCentre: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainCentre', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seat: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
