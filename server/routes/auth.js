const express = require("express");
const passport = require("passport");
const passportService = require('../services/passport');

const router = express.Router();

const authenticationController = require("../controllers/authentication_controller");

router.post("/", authenticationController.signup);
router.post("/signin", passport.authenticate('local', { session: true }), authenticationController.signin);
router.get("/spotify", passport.authenticate("spotify", {
  scope: ["user-read-email", "user-read-private"],
  callbackURL: "http://localhost:3000/auth/spotify/callback"
}));

router.get("/spotify/callback", passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
  res.redirect("/"); 
});

module.exports = router;