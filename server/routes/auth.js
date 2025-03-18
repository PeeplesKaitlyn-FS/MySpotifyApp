const express = require("express");
const passport = require("passport");
const passportService = require('../services/passport');

const protectedRoute = passport.authenticate('local', { session: false }); 

const router = express.Router();

const authenticationController = require("../controllers/authentication_controller");

router.post("/", authenticationController.signup);
router.post("/signin", protectedRoute, authenticationController.signin);


module.exports = router;
