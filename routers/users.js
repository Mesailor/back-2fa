const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const {
  findOne,
  createUser,
  updateUser,
  validate,
} = require("../models/users");

router.get("/", (req, res) => {
  return res.send("Hello user!");
});

// Setup 2FA - Generate secret and QR code
router.post("/setup", async (req, res) => {
  const { value, error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already exists
  const existingUser = findOne({ name: value.name });
  if (existingUser) {
    return res.status(400).send("User already exists!");
  }

  // Generate a secret for the user
  const secret = speakeasy.generateSecret({
    name: `Back2FA (${value.name})`,
    length: 32,
  });

  // Create user with temporary secret
  createUser({
    name: value.name,
    tempSecret: secret.base32,
    secret: null, // Will be set after verification
  });

  // Generate QR code
  try {
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message:
        "Scan the QR code with your authenticator app, then verify with /api/users/verify",
    });
  } catch (err) {
    res.status(500).send("Error generating QR code");
  }
});

// Verify and enable 2FA
router.post("/verify", async (req, res) => {
  const { name, token } = req.body;

  if (!name || !token) {
    return res.status(400).send("Name and token are required");
  }

  const user = findOne({ name });
  if (!user) {
    return res.status(404).send("User not found!");
  }

  if (user.secret) {
    return res.status(400).send("2FA already enabled for this user");
  }

  // Verify the token with the temporary secret
  const verified = speakeasy.totp.verify({
    secret: user.tempSecret,
    encoding: "base32",
    token: token,
    window: 2, // Allow 2 time steps before/after for clock skew
  });

  if (verified) {
    // Enable 2FA by moving tempSecret to secret
    updateUser(name, {
      secret: user.tempSecret,
      tempSecret: null,
    });
    res.send("2FA successfully enabled!");
  } else {
    res.status(401).send("Invalid token!");
  }
});

router.post("/", async (req, res) => {
  const { value, error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = createUser({
    name: value.name,
    secret: value.secret,
    tempSecret: value.tempSecret,
  });
  res.send(user.secret ? user.secret.toString() : "User created");
});

module.exports = router;
