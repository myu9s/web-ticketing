const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
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
    const { username, password } = JSON.parse(event.body);
    
    // Cari admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Admin tidak ditemukan' })
      };
    }

    // Periksa password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Password salah' })
      };
    }

    // Buat token
    const token = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Login berhasil',
        token 
      })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};