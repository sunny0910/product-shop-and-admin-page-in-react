var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/userController');

router.post('/signup', userController.userSignUp);

router.delete('/:userId', userController.userDelete);

router.get('/:userId', checkAuth, userController.getUser);

router.patch('/:userId', checkAuth, userController.userUpdate);

router.post('/login', userController.userLogIn);

router.get('/', checkAuth, userController.users);

module.exports = router;