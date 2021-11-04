const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('../../config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route  GET api/users
// @desc   Get All users
// @access Public 
router.get('/', (req, res) => {
  User.find()
    .sort({ registerDate: 1 })
    .then(users => res.json(users))
});

// @route  POST api/users
// @desc   Create a User
// @access Public
router.post('/', (req, res) => {
  const {name, email, password} = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({success: false, msg: 'Please enter all fields'})
  }

  // Check existing user
  User.findOne({ email })
    .then( user => {
      if (user) return res.status(400).json({success: false, msg: 'Email already exists'});

      const newUser = new User({ 
        name,
        email,
        password
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then( user => {

              jwt.sign(
                { id: user._id },
                config.jwtSecret,
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
            });
        })
      })


    })

});

// @route  DELETE api/users/:id
// @desc   Delete a User
// @access Public 
router.delete('/:id', (req, res) => {
  User.findById(req.params.id)
    .then( user => user.remove().then( () => res.json({success: true})))
    .catch( err => res.status(404).json({success: false}))
});

module.exports = router;