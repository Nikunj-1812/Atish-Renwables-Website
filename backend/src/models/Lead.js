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
      required: false,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => !value || value === 'calculator' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
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
      required: false,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'in_progress', 'contacted', 'converted', 'rejected'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: ['new', 'in_progress', 'contacted', 'converted', 'rejected'],
            required: true,
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: function defaultStatusHistory() {
        const currentStatus = this.status || 'new';
        return [{ status: currentStatus, changedAt: new Date() }];
      },
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