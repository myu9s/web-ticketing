const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true
  },
  formData: {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    ticketCount: { type: Number, required: true }
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
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);