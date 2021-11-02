require('dotenv').config()

module.exports = {
  mongoURI:  process.env.MONGO_URI || 'mongodb+srv://ariel:Asd$123!@mflix.fy047.mongodb.net/test',
  port: process.env.PORT || 5000
}