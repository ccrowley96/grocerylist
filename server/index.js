const express = require('express');
const bodyParser = require('body-parser');
const API = require('./api/index');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT;

// Enable Cross Origin Requests with CORS
app.use(cors({credentials: true, origin: true}));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//API Endpoint Router
app.use('/api', API);

// Static Files
app.use(express.static(path.join(__dirname, '../client/build')));

//Default catch all -> to index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// //Default catch all -> to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

//Start Listening
app.listen(port, () => {
    console.log(`List App server running on port: ${port}!`);
  }
);

