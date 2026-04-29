/**
 * Database Configuration File
 * Connects to MongoDB using Mongoose
 */

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is not set. Add it to your backend .env file.');
  }

  try {
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;
