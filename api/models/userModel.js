var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);