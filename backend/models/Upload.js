/////////////////////////////////////////////////////////////////////

  //Schema für die Bilder

/////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UploadSchema = new Schema({
    filename: {
        type: String,
        require: true
    },
    filepath: {
        type: String,
        require: true
    },
    fileuser: {
        type: String,
        require: true
    },
    filedescription: {
        type: String,
        require: true
    },
    filecategory: {
        type: String
    },
    filetags: {
        type: String
    },
    file_date: {
        type: Date,
        default: Date.now
    },
});


//Setzt die jeweilgen Datenpunkte auf Text für die Suche
UploadSchema.index({ 
    filename: 'text',
    fileuser: 'text',
    filecategory: 'text',
    filetags: 'text',
})

module.exports = Upload = mongoose.model("Uploads", UploadSchema);