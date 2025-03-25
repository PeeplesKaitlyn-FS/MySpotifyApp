const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication_controller');

router.post('/signin', authenticationController.signin);
router.get('/callback', authenticationController.callback);
router.post('/signup', authenticationController.signup);

module.exports = router;