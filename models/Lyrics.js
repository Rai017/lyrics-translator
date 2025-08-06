const mongoose = require('mongoose');

const lyricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalLyrics: String,
  translatedLyrics: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lyrics', lyricsSchema);
