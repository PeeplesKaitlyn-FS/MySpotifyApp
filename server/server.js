const express = require("express");
require('dotenv').config({ path: './server/.env' });
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require('passport');

console.log(process.env.SPOTIFY_CLIENT_ID);
console.log(process.env.SPOTIFY_CLIENT_SECRET);
const SpotifyStrategy = require('passport-spotify').Strategy;
passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/callback',
  scope: ['user-read-email', 'user-read-private', 'playlist-read-private'],
}, (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile, accessToken, refreshToken);
}));

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database Connection Established"));

const songRouter = require("./routes/song");
app.use("/songs", songRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile');
});

const PORT = 3000;

// Static build folder
app.use(express.static(path.join(__dirname, "../client/public")));

// Serve index.html for any unknown routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;