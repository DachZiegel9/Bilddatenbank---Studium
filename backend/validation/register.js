/////////////////////////////////////////////////////////////////////

  //Validierung für den Registrierung

/////////////////////////////////////////////////////////////////////

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //Prüfen, ob der Name vorhanden ist
  if (Validator.isEmpty(data.name)) {
    errors.name = "Bitte Benutzernamen angeben";
  }

  //Prüfen, ob die E-Mail gültig oder vorhanden ist
  if (Validator.isEmpty(data.email)) {
    errors.email = "Bitte E-Mail angeben";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email ist ungültig";
  }

  //Prüfen, ob das Passwort mit der zweiten Eingabe übereinstimmt, vorhanden ist und 6 Zeichen hat
  if (Validator.isEmpty(data.password)) {
    errors.password = "Bitte Passwort angeben";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Bitte Passwort bestätigen";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Passwort muss 6 Zeichen haben";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwörter stimmen nicht überein";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};