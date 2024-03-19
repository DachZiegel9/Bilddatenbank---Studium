/////////////////////////////////////////////////////////////////////

  //Weiterleitungen für die Kommentare

/////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();

const ImageComment = require("../../models/ImageComment");


router.get("/", function(req, res, next){
    res.render("index", {title: "Express"});
});


//speichern der Kommentare auf der Datenbank
router.post("/commentDB", (req, res) => {

    const imagecomment = new ImageComment(req.body);

    imagecomment.save((err) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true })
    })

});


//Aufrufen alle Kommentare, die zu dem jeweiligen Bild gesucht werden
router.post("/getComments", (req, res) => {

    var term = new RegExp( req.body.searchTerm, 'i');

    var order = "desc";
    var sortBy = "comment_date";

    ImageComment.find()
        .find({commentimage: term }, function (err, Comments) {})
        .sort([[sortBy, order]])
        .exec((err, Comments) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, Comments})
        });

});

module.exports = router;
