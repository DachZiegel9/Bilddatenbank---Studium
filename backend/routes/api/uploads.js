/////////////////////////////////////////////////////////////////////

  //Weiterleitungen für die Bilder

/////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const multer = require("multer");

const Upload = require("../../models/Upload");

const fs = require('fs');

//Multer speichern der Bilder im Backend
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        const path = require('path');
        const ext = path.extname(file.originalname);
        const {body: {ueberschrift}} = req;

        var replaced = ueberschrift.split(' ').join('_');

        cb(null, `${replaced}`+`${ext}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('Nur .png und .jpg zugelassen'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file");


router.get("/", function(req, res, next){
    res.render("index", {title: "Express"});
});


//speichern der Bilder im Backend
router.post("/uploadImage", async function(req, res, next){

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ 
            success: true, 
            image: res.req.file.path, 
            fileName: res.req.file.filename, 
        })
    })

});


//speichern der Bilder auf der Datenbank
router.post("/uploadImageDB", (req, res) => {

    const upload = new Upload(req.body);

    upload.save((err) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true })
    })

});


//Aufrufen aller Bilder, die ggf nach user, bildname, bildkategorie & tags gesucht wird
router.post("/getImage", (req, res) => {

    var term = new RegExp( req.body.searchTerm, 'i');

    var order = "desc";
    var sortBy = "file_date";

    Upload.find()
        .find({ $or: [{
            fileuser: term
        }, {
            filename: term
        }, {
            filecategory: term
        }, {
            filetags: term
        }]}, function (err, upload) {})
        .sort([[sortBy, order]])
        .exec((err, Uploads) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, Uploads})
        });

});


//Aufrufen aller Bilder, die nur nach dem user gesucht wird
router.post("/getImageProfil", (req, res) => {

    var term = new RegExp( req.body.searchTerm, 'i');

    var order = "desc";
    var sortBy = "file_date";

    Upload.find()
        .find({ fileuser: term }, function (err, upload) {})
        .sort([[sortBy, order]])
        .exec((err, Uploads) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, Uploads})
        });

});


//Aufrufen aller Bilder, die nur nach dem _id gesucht wird
router.post("/getImageDetail", (req, res) => {

    var term = req.body.searchTerm;

    Upload.find({ _id : term }, function (err, upload) {})
        .exec((err, Uploads) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, Uploads})
        });

});


//Löschung des Bildes in der Datenbank und im Backend
router.delete("/deleteImage", (req, res) => {

    var term = req.query.id;
    var path = req.query.path;

    fs.unlink(path, (err) => {
        if (err) throw err;
    });

    Upload.findOne({ _id : term })
        .exec((err,Uploads)=>{
            Uploads.deleteOne()
                .then(result=>{res.json(result)})
                .catch(err=>{console.log(err)});
        });

});

module.exports = router;