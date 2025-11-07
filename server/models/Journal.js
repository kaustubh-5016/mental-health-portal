const mongoose = require('mongoose');
const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  mood: { type: String },
  sentimentScore: { type: Number }
}, { timestamps: true });
module.exports = mongoose.model('Journal', JournalSchema);
