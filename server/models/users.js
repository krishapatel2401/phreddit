// LinkFlair Document Schema

const mongoose = require('mongoose');
// const { schema } = require('./communities');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
        // required: true
    },
    lastName: {
        type: String
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    reputationValue: {
        type: Number,
        required: true,
        default: 100
    }


});

userSchema.virtual('url').get(function(){
    return `/users/${this._id}`;
});

const User = mongoose.model('User', userSchema);
module.exports = User;