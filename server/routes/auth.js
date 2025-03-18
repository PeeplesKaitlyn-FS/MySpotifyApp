const express = require("express");
const passport = require("passport");
const passportService = require('../services/passport');

const router = express.Router();

const authenticationController = require("../controllers/authentication_controller");

router.post("/", authenticationController.signup);
router.post("/signin", passport.authenticate('local', { session: true }), authenticationController.signin);

module.exports = router;