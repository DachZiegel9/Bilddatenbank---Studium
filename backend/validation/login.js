/////////////////////////////////////////////////////////////////////

  //Validierung für den Login

/////////////////////////////////////////////////////////////////////

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Prüfen, ob die E-Mail übereinstimmt oder vorhanden ist
  if (Validator.isEmpty(data.email)) {
    errors.email = "Bitte E-Mail angeben";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email ist ungültig";
  }

  //Prüfen, ob das Passwort vorhanden ist
  if (Validator.isEmpty(data.password)) {
    errors.password = "Bitte Passwort angeben";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};