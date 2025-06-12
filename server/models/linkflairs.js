// LinkFlair Document Schema

const mongoose = require('mongoose');
const { schema } = require('./communities');
const Schema = mongoose.Schema;

const linkflairSchema = new Schema({
    content: String


});

linkflairSchema.virtual('url').get(function(){
    return `/linkflairs/${this._id}`;
});

const LinkFlair = mongoose.model('LinkFlair', linkflairSchema);
module.exports = LinkFlair;