const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');

const items = require('./routes/api/items');

const app = express();

// Bodyparser Middle-ware
app.use(bodyParser.json());

// DB Config
const db = config.mongoURI;

// Connect to mongo
mongoose
  .connect(db)
  .then ( () => console.log('MongoDB connected...'))
  .catch (err => console.log(err))

// User routes
app.use('/api/items', items);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = config.port;

app.listen(port, () => console.log(`Server started on port ${port}`));