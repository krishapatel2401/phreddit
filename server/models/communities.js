// Community Document Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: String,
    description: String,
    postIDs:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default:[]
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    members:{
        type:[String],
        validate:{
            validator: function(arr){
                return arr.length>0;
            },
            message:'members array of a community mus contain at least 1 element'
        }
    },
    creator: {
        type: String,
        required: true
        // type: mongoose.Schema.Types.ObjectId,
        // required: true,
        // ref: 'User'
    }

    // memberCount: Number
});

communitySchema.virtual('url').get(function(){
    return `/communities/${this._id}`;
});

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;