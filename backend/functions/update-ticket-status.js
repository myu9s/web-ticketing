const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  // Koneksi MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Cek metode HTTP
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  // Validasi Authorization
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized: Token tidak valid' })
    };
  }

  try {
    // Verifikasi token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Parse body request
    const { ticketId, newStatus } = JSON.parse(event.body);

    // Validasi status
    const validStatuses = ['pending', 'active', 'non-active'];
    if (!validStatuses.includes(newStatus)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Status tidak valid' })
      };
    }

    // Cari dan update tiket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Tiket tidak ditemukan' })
      };
    }

    // Update status
    ticket.status = newStatus;
    ticket.statusHistory.push({
      status: newStatus,
      changedBy: 'admin', // Bisa diganti dengan username admin sebenarnya
      changedAt: new Date()
    });

    await ticket.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Status tiket berhasil diupdate',
        ticket: {
          id: ticket._id,
          status: ticket.status
        }
      })
    };
  } catch (error) {
    // Handle error token atau lainnya
    if (error.name === 'JsonWebTokenError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token tidak valid' })
      };
    }

    console.error('Error update status tiket:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Gagal update status tiket',
        error: error.message 
      }) 
    };
  }
};