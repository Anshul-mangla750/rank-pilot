const mongoose = require('mongoose');
const config = require('./env');

// Disable operation buffering so queries never hang if database is offline or IP restricted
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      dbName: 'rankpilot',
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('\n============================================================');
    console.warn('⚠️  MONGODB ATLAS IP NOT WHITELISTED');
    console.warn(`Connection error: ${error.message}`);
    console.warn('To connect to Atlas:');
    console.warn('1. Open cloud.mongodb.com -> Network Access');
    console.warn('2. Click "Add IP Address" -> choose "Allow Access from Anywhere" (0.0.0.0/0)');
    console.warn('Continuing server startup with instant fallback mode...');
    console.warn('============================================================\n');
  }
};

module.exports = connectDB;
