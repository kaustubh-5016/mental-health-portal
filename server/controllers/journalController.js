const mongoose = require('mongoose');
const Journal = require('../models/Journal');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Simple in-memory fallback when MongoDB is not configured/connected.
// This lets the UI and API still function for local development without a DB.
const inMemoryJournals = [];

exports.createJournal = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const result = sentiment.analyze(text || '');
    const mood = result.score > 1 ? 'positive' : result.score < -1 ? 'negative' : 'neutral';
    const journalData = {
      user: userId,
      text,
      mood,
      sentimentScore: result.score,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If mongoose isn't connected, store journals in-memory and return a fake document
    if (mongoose.connection.readyState !== 1) {
      const fakeDoc = { _id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, ...journalData };
      // keep most recent first
      inMemoryJournals.unshift(fakeDoc);
      return res.json(fakeDoc);
    }

    const journal = new Journal(journalData);
    await journal.save();
    res.json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getByUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const journals = inMemoryJournals.filter(j => String(j.user) === String(req.params.userId));
      return res.json(journals);
    }
    const journals = await Journal.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
