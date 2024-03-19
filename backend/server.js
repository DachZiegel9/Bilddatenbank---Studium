const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const upload = require("./routes/api/uploads");
const imagecomment = require("./routes/api/imagecomments");
const imagecollection = require("./routes/api/imagecollections");


const app = express();

const cors = require('cors');
app.use(cors());

//Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//Verbindung zur MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Router
app.use("/api/users", users);

app.use("/api/uploads", upload);

app.use("/api/imagecomments", imagecomment);

app.use("/api/imagecollections", imagecollection);



app.use('/images', express.static('images'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));