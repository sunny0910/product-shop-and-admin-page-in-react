var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.userSignUp);

router.delete('/:userId', userController.userDelete);

router.get('/:userId', userController.getUser);

router.patch('/:userId', userController.userUpdate);

router.post('/login', userController.userLogIn);

router.get('/', userController.users);

module.exports = router;