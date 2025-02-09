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
    const { name, whatsapp, performanceDate, ticketCount } = JSON.parse(event.body);
    
    // Validasi input
    if (!name || !whatsapp || !performanceDate || !ticketCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Semua field wajib diisi' })
      };
    }

    // Validasi nomor WhatsApp
    const whatsappRegex = /^08[0-9]{9,11}$/;
    if (!whatsappRegex.test(whatsapp)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Nomor WhatsApp tidak valid' })
      };
    }

    // Validasi jumlah tiket
    if (ticketCount < 1 || ticketCount > 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Jumlah tiket harus antara 1-4' })
      };
    }

    // Cek ketersediaan tiket untuk jadwal tertentu
    const existingTickets = await Ticket.countDocuments({ 
      'formData.performanceDate': performanceDate 
    });

    // Misalnya, kapasitas maksimal 50 tiket per pertunjukan
    if (existingTickets + parseInt(ticketCount) > 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Tiket untuk jadwal ini sudah habis' })
      };
    }

    const newTicket = new Ticket({
      uniqueCode: uuidv4(),
      formData: { 
        name, 
        whatsapp, 
        performanceDate, 
        ticketCount 
      },
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        changedBy: 'system'
      }]
    });

    await newTicket.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Tiket berhasil didaftarkan',
        ticketId: newTicket._id,
        uniqueCode: newTicket.uniqueCode
      })
    };
  } catch (error) {
    console.error('Error registrasi tiket:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Gagal mendaftarkan tiket',
        error: error.message 
      }) 
    };
  }
};