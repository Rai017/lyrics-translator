const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ fullname, email, password: hashed });
    res.redirect('/login');
  } catch {
    res.send('Error registering user');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Wrong password');

  const token = jwt.sign({ id: user._id, fullname: user.fullname }, process.env.JWT_SECRET);
  res.cookie('jwt', token).redirect('/lyrics/dashboard');
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
};
