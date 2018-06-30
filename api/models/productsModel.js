var mongoose = require('mongoose');
var productSchema = mongoose.Schema({
    name : String,
    price : Number
});

module.exports = mongoose.model('Product', productSchema);