const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }    
});

module.exports = mongoose.model('categories', categoriesSchema);