const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const localStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

const localOptions = {
    usernameField: 'email'
}
const localLogin = new localStrategy(localOptions, function(email, password, done){
    User.findOne({email: email}, function(error, user){
        if(error){return done(error)}
        if(!user) {
            return done(null, false)
        }
        user.comparePassword(password, function(error, isMatch){
            if(error){return done(error)}
            if(!isMatch) {
                return done(null, false)
            }
            return done(null, user)
        })
    })
})

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    console.error('Error handling JWT authentication:', err);
    done(err, null);
  }
});

const spotifyOptions = {
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: '/auth/spotify/callback',
};

const spotifyLogin = new SpotifyStrategy(spotifyOptions, async (accessToken, refreshToken, expires_in, profile, done) => {
  try {
    const user = await User.findOne({ spotifyId: profile.id });
    if (!user) {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      const newUser = new User({ spotifyId: profile.id, email });
      await newUser.save();
      done(null, newUser);
    } else {
      done(null, user);
    }
  } catch (err) {
    console.error('Error handling Spotify authentication:', err);
    done(err);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);
passport.use(spotifyLogin);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});