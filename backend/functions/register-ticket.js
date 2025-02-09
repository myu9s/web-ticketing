const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
  // Koneksi MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { name, whatsapp, ticketCount } = JSON.parse(event.body);
    
    const newTicket = new Ticket({
      uniqueCode: uuidv4(),
      formData: { name, whatsapp, ticketCount },
      status: 'pending'
    });

    await newTicket.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Tiket berhasil didaftarkan',
        ticketId: newTicket._id 
      })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};