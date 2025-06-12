// Post Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    linkFlairID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LinkFlair'
    },
    postedBy: {
        type: String,
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    commentIDs:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
        default:[]
    },
    views: {
        type: Number,
        default: 1,
        required: true
    },
    upvotes: {
        type: Number,
        required: true,
        default: 0
    }

});

PostSchema.virtual('url').get(function(){
    return `/posts/${this._id}`;
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;