var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/userController');

router.post('/signup', userController.userSignUp);

router.post('/login', userController.userLogIn);

router.delete('/:userId', checkAuth, userController.userDelete);

router.delete("/", checkAuth, userController.deleteMultipleUsers);

router.get('/:userId', checkAuth, userController.getUser);

router.patch('/:userId', checkAuth, userController.userUpdate);

router.get('/', checkAuth, userController.users);

module.exports = router;