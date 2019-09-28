const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const commentSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    postId: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    commentDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comments', commentSchema)