var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
const rolesController = require('../controllers/rolesController');

router.get('/', rolesController.getAllRoles);

router.post('/', checkAuth, rolesController.addRole);

module.exports = router;