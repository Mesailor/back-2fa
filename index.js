const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routers/users');
const twofaMeddleware = require('./middlewares/twofa');

app.use(express.json());
app.use('/api/users', userRouter);

app.get('/', twofaMeddleware, (req, res) => {
    return res.send('Some information to authorised user');
});

mongoose.connect('mongodb://localhost:8088/back2fa')
    .then(() => {
        console.log('Connected to DB...');
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});