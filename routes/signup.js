const express = require('express');
const controller = require('../controllers/signup');
const router = express.Router();

router.post('/signup',controller.postSignUp);

module.exports = router;