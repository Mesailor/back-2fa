const { User } = require('../models/users');
const generateCode = require('../generateCode');

async function twofaMeddleware(req, res, next) {
    const username = req.get('x-username');
    const user = await User.findOne({ name: username});
    const serverCode = generateCode(user.key);
    const userCode = req.body.code;

    if (userCode !== serverCode) {
        return res.status(401).send('Wrong code sent!');
    }
    next();
}

module.exports = twofaMeddleware;