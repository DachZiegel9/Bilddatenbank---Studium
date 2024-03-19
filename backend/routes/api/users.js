/////////////////////////////////////////////////////////////////////

  //Weiterleitungen für die User

/////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");

//speichern der Userdaten auf der Datenbank
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Validierung bei Registrierung checken
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      //Hashverfahren für das Passwort
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//prüfen ob die Logindaten vorhanden sind
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Validierung bei Login checken
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {

    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    //Prüfen ob das Passwort übereinstimmt
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        //Login Token erstellt
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 864900
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;