const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/users');

router.get('/', (req, res) => {
    return res.send('Hello user!');
});

router.post('/', async (req, res) => {
    const { value, error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const user = new User({
        name: value.name,
        key: value.key //Key is got from client. We should change it.
    });
    await user.save();
    res.send(user.key.toString());
});

module.exports = router;