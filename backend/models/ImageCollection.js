/////////////////////////////////////////////////////////////////////

  //Schema für die Kollektion

/////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageCollectionSchema = new Schema({
    collectionname: {
        type: String,
        require: true
    },
    collectionuser: {
        type: String,
        require: true
    },
    collectionimages: {
        type: Array,
        default: [],
        require: true
    },
    collection_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = ImageCollection = mongoose.model("ImageCollections", ImageCollectionSchema);