//built-in
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

//models
let User = require("../models/users");

let Registercontroller = async (req, res) => {
  let password = req.body.password;
  req.body.password = await bcrypt.hash(password, 10);
  let newUser = new User(req.body);
  await newUser.save();
  let payload = { id: newUser._id, name: newUser.name };
  let secret = "mysecret";
  let token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return res.status(201).json({ token });
};

let Logincontroller = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  let payload = { id: user._id, name: user.name };
  let secret = "mysecret";
  let token = jwt.sign(payload, secret, { expiresIn: "1h" });
  res.status(200).json({ token });
};

module.exports = { Registercontroller, Logincontroller };
