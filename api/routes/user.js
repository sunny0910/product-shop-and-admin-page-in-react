var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.userSignUp);

router.delete('/:userId', userController.userDelete);

router.post('/login', userController.userLogIn);

module.exports = router;