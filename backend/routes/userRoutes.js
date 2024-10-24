const express = require('express');
const { register } = require('../controllers/registerController.js');
const router = express.Router();

router.post('/register', register);


module.exports = router;