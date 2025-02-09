const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');

exports.handler = async (event, context) => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    const tickets = await Ticket.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(tickets)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};