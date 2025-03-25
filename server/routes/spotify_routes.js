const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication_controller');

router.post('/signin', authenticationController.signin);
router.get('/callback', authenticationController.callback);
router.post('/signup', authenticationController.signup);

router.get('/tracks', authenticationController.getTracks);
module.exports = (app) => {
    app.use('/tracks', router);
  };

module.exports = router;