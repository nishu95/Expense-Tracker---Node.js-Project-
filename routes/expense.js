const express = require('express');
const expenseController = require('../controllers/expense');
const router = express.Router();

router.post('/expense', expenseController.expensePost);
router.get('/expense', expenseController.expenseGet);
router.delete('/delete/:id', expenseController.expenseDelete);

module.exports = router;