const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    urlImage: String,
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users', usersSchema);