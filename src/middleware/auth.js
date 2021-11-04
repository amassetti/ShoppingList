const config = require('../config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  // Check token
  if (!token) return res.status(401).json({ success: false, msg: 'No token. Authorization denied.'})
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Add user
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ success: false, msg: 'Token is not valid.'});
  }
}

module.exports = auth;