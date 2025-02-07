const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Registrasi Tiket
router.post('/register', async (req, res) => {
    try {
        const { name, whatsapp, ticketCount } = req.body;

        // Generate unique code
        const uniqueCode = uuidv4();

        // Generate QR Code
        const qrCodeUrl = await QRCode.toDataURL(uniqueCode);

        // Buat tiket baru
        const newTicket = new Ticket({
            uniqueCode,
            formData: { name, whatsapp, ticketCount },
            qrCodeUrl,
            statusHistory: [{
                status: 'pending',
                changedBy: 'system'
            }]
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Tiket berhasil didaftarkan',
            ticket: {
                uniqueCode,
                whatsapp
            }
        });
    } catch (error) {
        console.error('Error registrasi tiket:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan tiket' });
    }
});

module.exports = router;