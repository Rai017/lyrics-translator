const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  dashboard,
  translate,
  saved,
  save,
  delete: deleteLyric
} = require('../controllers/lyricsController');

router.get('/dashboard', requireAuth, dashboard);

router.get('/convert', requireAuth, (req, res) => {
  res.render('convert', { title: 'Convert Lyrics', user: req.user });
});

router.post('/translate', requireAuth, translate);
router.post('/save', requireAuth, save);
router.get('/saved', requireAuth, saved);
router.get('/delete/:id', requireAuth, deleteLyric);

module.exports = router;
