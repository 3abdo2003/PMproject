// models/TrainingCentre.js
const mongoose = require('mongoose');

const trainCentreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date },
  time: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/i.test(v);
      },
      message: props => `${props.value} is not a valid time format. Please use HH:MM AM/PM format.`,
    },
    required: true,
  },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  contactInfo: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
}, {
  timestamps: true,
});

const TrainCentre = mongoose.model('TrainCentre', trainCentreSchema);

module.exports = TrainCentre;
