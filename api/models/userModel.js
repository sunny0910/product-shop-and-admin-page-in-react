var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    secondName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);