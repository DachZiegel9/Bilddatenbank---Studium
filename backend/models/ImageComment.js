/////////////////////////////////////////////////////////////////////

  //Schema für die Kommentare

/////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageCommentSchema = new Schema({
    commentname: {
        type: String,
        require: true
    },
    commentuser: {
        type: String,
        require: true
    },
    commentimage: {
        type: String,
        require: true
    },
    comment_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = ImageComment = mongoose.model("ImageComments", ImageCommentSchema);