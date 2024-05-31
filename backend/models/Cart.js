// models/Cart.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      trainingCentre: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainCentre', required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      seat: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);
