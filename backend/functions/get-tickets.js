const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');

exports.handler = async (event, context) => {
  // Pastikan hanya admin yang bisa akses
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    // Ambil parameter filter opsional
    const { status, performanceDate } = event.queryStringParameters || {};

    // Bangun query
    const query = {};
    if (status) query['status'] = status;
    if (performanceDate) query['formData.performanceDate'] = performanceDate;

    const tickets = await Ticket.find(query);
    
    return {
      statusCode: 200,
      body: JSON.stringify(tickets)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Gagal mengambil tiket',
        error: error.message 
      })
    };
  }
};