var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/login', function(req, res, next) {
//   // res.render('./view/src/components/admin/login');
//   // console.log('login');
//   // res.json(
//   //     {id:1, firstName: 'sunny'}
//   // );
//   // res.end();
// });

// router.get('/register', function(req, res, next) {
//   // res.render('./view/src/components/admin/register');
//   // console.log('regi');
// });

module.exports = router;
