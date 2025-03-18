const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication_controller');

router.get('/signin', authenticationController.signin);
router.get('/callback', authenticationController.callback);
router.get('/signup', authenticationController.signup);

module.exports = router;