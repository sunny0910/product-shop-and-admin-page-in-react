var mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017/products';

mongodb.connect(uri, {
    useNewUrlParser: true
});

var db = mongodb.connection;

console.log(db);

function create(reu) {
    db.collection
}