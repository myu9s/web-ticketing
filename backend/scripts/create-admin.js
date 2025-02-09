require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    // Koneksi ke database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Cek apakah admin sudah ada
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin sudah ada');
      process.exit(0);
    }

    // Buat admin baru
    const admin = new Admin({
      username: 'admin',
      password: 'AdminTeater2024!' // Gunakan password yang kuat
    });

    await admin.save();
    console.log('Admin berhasil dibuat');
    process.exit(0);
  } catch (error) {
    console.error('Gagal membuat admin:', error);
    process.exit(1);
  }
}

createAdmin();