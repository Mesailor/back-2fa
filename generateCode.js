const speakeasy = require("speakeasy");

module.exports = function verifyToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });
};
