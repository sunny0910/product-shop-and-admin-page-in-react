var mongoose = require('mongoose');
var rolesSchema = mongoose.Schema({
    _id : {
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Roles', rolesSchema);