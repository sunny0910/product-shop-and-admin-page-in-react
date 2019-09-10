var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
let uri = 'mongodb://localhost:27017/products';
if (process.env.ENV == "production") {
  uri = "mongodb+srv://admin:MongoDb123@cluster0-7doi5.mongodb.net/products?retryWrites=true&w=majority"
}
require('dotenv').config();

var productRouter = require('./api/routes/products');
var userRouter = require('./api/routes/user');
var rolesRouter = require('./api/routes/roles');
mongoose.Promise = global.Promise;
var dbConnected = true;
mongoose.connect(uri, {useNewUrlParser: true})
.then(
  () => console.log('Connected to the DB')
)
.catch(
  (err) => {
    console.log('DB Connection failed '+ err);
    dbConnected = false;
  }
)
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  // res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers']);
  next();
});

app.use((req, res, next) => {
  if (!dbConnected) {
    return res.status(500).json({"message": "DB Connection Failed"});
  }
  next();
});

app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter);
app.use('/api/v1/roles', rolesRouter)

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + 'client' ,'build', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
