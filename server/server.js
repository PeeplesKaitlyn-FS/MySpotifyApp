const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// Set up database connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Database connection established'))
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

// Set up passport
passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: '/callback',
}, (accessToken, refreshToken, expires_in, profile, done) => {
  const user = { accessToken, refreshToken, expires_in, profile };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/callback', passport.authenticate('spotify', {
  failureRedirect: '/login',
}), (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  req.session.user = req.user;
  res.redirect('/tracks');
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
});

const tracksRouter = require("./routes/tracks");
app.use("/tracks", tracksRouter);

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

const playlistsRouter = require("./routes/playlists");
app.use("/playlists", playlistsRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;