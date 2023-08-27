const express = require('express');
const passwordController = require('../controllers/password');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.post('/password/forgotpassword',passwordController.forgetPassword);

module.exports = router;