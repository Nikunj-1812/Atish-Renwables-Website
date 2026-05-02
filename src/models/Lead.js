const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please provide a valid email address.',
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    requirement: {
      type: String,
      required: true,
      enum: ['industrial', 'commercial', 'residential'],
    },
    monthlyBill: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'contacted', 'converted'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;