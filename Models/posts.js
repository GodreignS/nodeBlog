const mongoose = require('mongoose');

const postsSchemas = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    subTitle: String,        
    category: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    urlImage: String,    
    postDate: {
        type: Date,
        default: Date.now
    }    
});

module.exports = mongoose.model('posts', postsSchemas);