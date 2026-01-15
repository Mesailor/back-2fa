const { findOne } = require("../models/users");
const verifyToken = require("../generateCode");

async function twofaMeddleware(req, res, next) {
  const username = req.get("x-username");
  const user = findOne({ name: username });

  if (!user) {
    return res.status(404).send("User not found!");
  }

  if (!user.secret) {
    return res.status(400).send("2FA not enabled for this user!");
  }

  const userToken = req.body.code;

  if (!userToken) {
    return res.status(400).send("Token is required!");
  }

  const isValid = verifyToken(user.secret, userToken.toString());

  if (!isValid) {
    return res.status(401).send("Invalid token!");
  }

  next();
}

module.exports = twofaMeddleware;
