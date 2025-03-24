const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/accountController');

router.post('/new-user', registerUser);

module.exports = router;
