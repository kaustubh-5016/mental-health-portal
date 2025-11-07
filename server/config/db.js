const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || '';

module.exports = async function connectDB() {
  try {
    if (!uri) {
      console.warn('MONGO_URI not set - skipping MongoDB connection (set MONGO_URI in .env to enable DB).');
      return;
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
