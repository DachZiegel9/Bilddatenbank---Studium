/////////////////////////////////////////////////////////////////////

  //Weiterleitungen für die Kollektion

/////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();

const ImageCollection = require("../../models/ImageCollection");


router.get("/", function(req, res, next){
    res.render("index", {title: "Express"});
});


//speichern der Kollektion auf der Datenbank
router.post("/collectionDB", (req, res) => {

    const imagecollection = new ImageCollection(req.body);

    imagecollection.save((err) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true })
    })

});


//Aufrufen alle Kollektionen, die nach dem User gesucht werden
router.post("/getCollection", (req, res) => {

    var term = new RegExp( req.body.searchTerm, 'i');

    var order = "desc";
    var sortBy = "comment_date";

    ImageCollection.find()
        .find({collectionuser: term }, function (err, collections) {})
        .sort([[sortBy, order]])
        .exec((err, collections) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, collections})
        });

});


//Aufrufen einer Kollektionen, die nach dem ID gesucht werden
router.post("/getCollectionDetail", (req, res) => {

    var term = req.body.searchTerm;

    ImageCollection.find({_id: term }, function (err, collections) {})
        .exec((err, collections) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, collections})
        });

});

module.exports = router;
