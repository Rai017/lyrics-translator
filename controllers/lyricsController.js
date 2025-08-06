const Lyrics = require('../models/Lyrics');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.showLyricsForm = (req, res) => {
  res.render('lyrics', {
    title: 'Lyrics Translator',
    translated: '',
    original: '',
    user: req.user,
    lyrics: [],
    targetLang: '' // default empty
  });
};
exports.translate = async (req, res) => {
  const { lyrics, targetLang } = req.body;

  try {
    const prompt = `Translate these lyrics into ${targetLang} in a poetic tone. Do not add extra lines or modify meaning:\n\n${lyrics}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 300
    });

    const translated = response.choices[0].message.content.trim();

    res.render('lyrics', {
      title: 'Translated Lyrics',
      translated,
      original: lyrics,
      user: req.user,
      lyrics: [],
      targetLang 
    });

  } catch (err) {
    console.error('Translation error:', err.message);
    res.send('Translation failed. Please try again.');
  }
};

exports.save = async (req, res) => {
  const { originalLyrics, translatedLyrics } = req.body;

  try {
    await Lyrics.create({
      userId: req.user._id,
      originalLyrics,
      translatedLyrics
    });

    res.redirect('/lyrics/saved');
  } catch (err) {
    res.send('Error saving lyrics');
  }
};
exports.saved = async (req, res) => {
  try {
    const lyrics = await Lyrics.find({ userId: req.user._id }).sort({ timestamp: -1 });

    res.render('saved', {
      title: 'Saved Lyrics',
      lyrics,
      user: req.user
    });
  } catch (err) {
    res.send('Error fetching saved lyrics');
  }
};

exports.delete = async (req, res) => {
  try {
    await Lyrics.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    res.redirect('/lyrics/saved');
  } catch (err) {
    res.send('Error deleting lyric');
  }
};

exports.dashboard = (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
};
