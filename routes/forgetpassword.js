const express = require('express');
const passwordController = require('../controllers/password');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.post('/password/forgotpassword',passwordController.forgetPassword);

router.get('/password/resetpassword/:uuid',passwordController.resetPassword);

router.post('/password/updatepassword/:uuid',passwordController.updatePassword);



module.exports = router;