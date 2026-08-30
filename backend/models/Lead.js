const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'],
  },
  grossWeightGrams: {
    type: Number,
    required: true,
    min: [0, 'Gross weight cannot be negative'],
  },
  netWeightGrams: {
    type: Number,
    required: true,
    min: [0, 'Net weight cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.grossWeightGrams;
      },
      message: 'Net weight cannot be greater than gross weight',
    }
  },
  purityKarat: {
    type: Number,
    required: true,
    enum: [18, 22, 24],
  },
  selectedPlanId: {
    type: String,
    required: true,
  },
  calculatedPureGoldGrams: {
    type: Number,
    required: true,
  },
  calculatedMaxLoanAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED',
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
