const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

// @route  POST api/auth
// @desc   Auth a User
// @access Public
router.post('/', (req, res) => {
  const {email, password} = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({success: false, msg: 'Please enter all fields'})
  }

  // Check existing user
  User.findOne({ email })
    .then( user => {
      if (!user) return res.status(400).json({success: false, msg: 'User does not exists'});

      // Validate passwrd
      bcrypt.compare(password, user.password)
        .then( isMatch => {
          if (!isMatch) return res.status(400).json({success: false, msg: 'Invalid credentials'});

          jwt.sign(
            { id: user._id },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email
                }
              })
            }
          )    
        })
    })
});

// @route  GET api/auth/user
// @desc   GET User data
// @access Private
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then( user => res.json(user))
});

module.exports = router;