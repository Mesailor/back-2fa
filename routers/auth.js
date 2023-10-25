const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const { User } = require('../models/users');
const generateCode = require('../generateCode');

router.get('/getCode/:username', async (req, res) => {
    const username = req.params.username;
    let user = await User.findOne({ name: username });

    if (!user) {
        const { secret, qrcode } = await generateCode();
        user = new User({
            name: username,
            key: secret.base32,
            qrcode: qrcode
        });
        await user.save();
        return res.send(`<img src=${qrcode}>`);
    }
    else {
        return res.send(`<img src=${user.qrcode}>`);
    }
});

router.get('/test/:username/:code', async (req, res) => {
    const code = req.params.code;
    const username = req.params.username;
    const user = await User.findOne({ name: username });
    const secret = user.key;

    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code
    });

    if (verified) {
        return res.send(200);
    }
    else {
        return res.status(401).send(401);
    }
});

module.exports = router;