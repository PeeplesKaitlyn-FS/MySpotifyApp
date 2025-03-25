const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication_controller');

router.post('/signin', authenticationController.signin);
router.get('/callback', authenticationController.callback);
router.post('/signup', authenticationController.signup);

router.get('/tracks', authenticationController.getTracks);
router.get('/playlists', authenticationController.getPlaylists);
router.get('/profile', authenticationController.getProfile);

router.get('/signout', authenticationController.signout);

module.exports = router;