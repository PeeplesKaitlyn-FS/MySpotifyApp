const express = require("express");
require('dotenv').config();
console.log(process.env);
console.log(process.env.SPOTIFY_CLIENT_ID);
console.log(process.env.SPOTIFY_CLIENT_SECRET);
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');

const spotifyStrategy = new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: '/auth/spotify/callback',
}, (accessToken, refreshToken, expires_in, profile, done) => {
  return done(null, profile, accessToken, refreshToken);
});

passport.use(spotifyStrategy); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database Connection Established"));

const songRouter = require("./routes/song");
app.use("/songs", songRouter);

const tracksRouter = require("./routes/tracks");
app.use("/tracks", tracksRouter.router);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const callbackRouter = require("./routes/callback");
app.use("/callback", callbackRouter);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;