const express = require('express');
const premiumController = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.get('/premium/showleaderboard', userAuthentication.authenticate ,premiumController.showleaderboard);

module.exports = router;