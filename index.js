const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routers/auth');

app.use(express.json());
app.use('/', authRouter);

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