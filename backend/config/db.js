/**
 * Database Configuration File
 * Connects to MongoDB using the backend .env configuration, with an in-memory fallback
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Function to connect to MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    // If a configured Mongo URI exists, try connecting to it first.
    if (mongoUri) {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        tls: true,
        tlsAllowInvalidCertificates: true,
      });

      console.log('MongoDB connected successfully');
      return mongoose.connection;
    }

    // No MONGO_URI provided — fall back to in-memory DB for local development.
    console.warn('MONGO_URI is not set in backend/.env — falling back to in-memory MongoDB.');

    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    await mongoose.connect(memoryUri);

    console.log('MongoDB (in-memory) connected successfully');
    return mongoose.connection;

  } catch (error) {
    // If a configured connection attempt failed, fall back to in-memory DB.
    console.warn(`Configured MongoDB connection failed: ${error.message}`);
    console.warn('Falling back to in-memory MongoDB so the app can keep running.');

    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    await mongoose.connect(memoryUri);

    console.log('MongoDB (in-memory) connected successfully');
    return mongoose.connection;
  }
};

// Function to disconnect and stop the server
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;