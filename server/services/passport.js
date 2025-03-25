const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local');
const mongoose = require('mongoose');

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
    const user = await User.findOne({ spotifyId: payload.sub });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);

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
        done(err, null);
    }
});