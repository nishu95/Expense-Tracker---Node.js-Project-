const express = require('express');
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.post('/expense', userAuthentication.authenticate , expenseController.expensePost);
router.get('/expense', userAuthentication.authenticate ,expenseController.expenseGet);
router.delete('/delete/:id', userAuthentication.authenticate , expenseController.expenseDelete);

module.exports = router;