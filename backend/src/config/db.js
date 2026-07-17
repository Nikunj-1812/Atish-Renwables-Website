const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  if (mongoUri.includes('<db_password>') || mongoUri.includes('<username>') || mongoUri.includes('<cluster-url>')) {
    throw new Error('MONGO_URI still contains placeholder values. Replace it with your real MongoDB Atlas connection string.');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed (serverSelectionTimeoutMS: 3s): ${error.message}`);
    console.warn('⚠️ Server will operate in resilient offline mode. Lead CRM records will be logged to system console.');
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected,
};