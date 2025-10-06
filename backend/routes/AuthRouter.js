const express = require("express");
const Router = express.Router();

//controllers
let {
  Registercontroller,
  Logincontroller,
} = require("../controllers/AuthController");

//custom middleware
let {
  Registervalidate,
  Loginvalidate,
  validate,
} = require("../middleware/validator");

Router.post("/register", Registervalidate(), validate, Registercontroller);
Router.post("/login", Loginvalidate(), validate, Logincontroller);

module.exports = Router;
