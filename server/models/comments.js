// Comment Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema  = new Schema({
    content: String,
    commentIDs:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
        default:[]
    },
    commentedBy: String,
    commentedDate: Date,
    upvotes: {
        type: Number,
        required: true,
        default: 0
    }
});

commentSchema.virtual('url').get(function(){
    return `/comments/${this._id}`;
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;