const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true
  },
  formData: {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    whatsapp: { 
      type: String, 
      required: true,
      match: [/^08[0-9]{9,11}$/, 'Nomor WhatsApp tidak valid']
    },
    performanceDate: { 
      type: String, 
      required: true,
      enum: [
        '2024-03-15-19:00', 
        '2024-03-16-19:00', 
        '2024-03-17-19:00'
      ]
    },
    ticketCount: { 
      type: Number, 
      required: true,
      min: [1, 'Minimal 1 tiket'],
      max: [10, 'Maksimal 10 tiket']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'non-active'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual untuk total harga
TicketSchema.virtual('totalPrice').get(function() {
  // Misalnya harga per tiket Rp 20.000
  return this.formData.ticketCount * 20000;
});

module.exports = mongoose.model('Ticket', TicketSchema);