const express = require('express');
const router = express.Router();
const room = require('./room');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// Connect to Mongo DB
if(process.env.NODE_ENV === 'dev') mongoose.connect(process.env.MONGO_CONNECT_DEV, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
else mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
//Check connection
db.once('open', () =>{
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', (err) => {
  console.log("Database Error!");
  console.log(err);
});

//API welcome Message
router.get('/', (req, res, next) => {
    res.send('Welcome to the List App API');
});

//API room routing
router.use('/room', room);

module.exports = router;

