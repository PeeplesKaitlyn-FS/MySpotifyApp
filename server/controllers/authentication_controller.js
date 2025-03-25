const User = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const config = require("../config")
const passport = require('passport');
const { getTracksFromSpotify } = require('../routes/tracks');


const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  const token = jwt.sign({
    sub: user.id,
    iat: timestamp,
    exp: timestamp + (60 * 60 * 24 * 7), // expires in 1 week
  }, config.secret);
  User.findByIdAndUpdate(user.id, { token }, { new: true }, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Token stored for user ${user.id}`);
    }
  });
  return token;
};


exports.signin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await User.findById(user.id).select('token');
    if (!token) {
      const newToken = tokenForUser(user);
      await User.findByIdAndUpdate(user.id, { token: newToken }, { new: true });
      res.send({ user_id: user._id, token: newToken });
    } else {
      res.send({ user_id: user._id, token: token.token });
    }
  } catch (error) {
    return next(error);
  }
}

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ message: "Email and password are required" });
    }
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValidEmail) {
      return res.status(422).json({ message: "Invalid email address" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: "Email is already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = tokenForUser(user);
    await User.findByIdAndUpdate(user.id, { token }, { new: true });
    res.json({ user_id: user._id, token });
  } catch (error) {
    return next(error);
  }
}

exports.callback = passport.authenticate('spotify', { failureRedirect: '/signin' }, async (req, res) => {
  if (req.user) {
    return res.status(401).json({ message: 'You are already authenticated' });
  }
  const user = req.user;
  const token = tokenForUser(user);
  const accessToken = req.user.accessToken = req.query.access_token; 
  req.session.accessToken = accessToken; 
  res.json({ user_id: user._id, token });
});

exports.signout = (req, res) => {
  res.send({ user_id: null, token: null })
}

exports.getTracks = async (req, res) => {
  console.log('Get tracks endpoint called');
  console.log('AccessToken:', req.session.accessToken);
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'You must be logged in to access this route' });
  }
  const accessToken = req.session.accessToken;
  try {
    const tracksFromSpotify = await getTracksFromSpotify(accessToken);
    res.json(tracksFromSpotify);
  } catch (error) {
    console.error('Error retrieving tracks from Spotify:', error);
    res.status(500).json({ message: 'Error retrieving tracks from Spotify' });
  }
};