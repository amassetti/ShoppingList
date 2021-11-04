const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./src/config');
const app = express();

// Bodyparser Middle-ware
app.use(express.json());

// DB Config
const db = config.mongoURI;

// Connect to mongo
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then ( () => console.log('MongoDB connected...'))
  .catch (err => console.log(err))

// Routes
app.use('/api/items', require('./src/routes/api/items'));
app.use('/api/users', require('./src/routes/api/users'));
app.use('/api/auth', require('./src/routes/api/auth'));


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