const { expressjwt: jwt } = require('express-jwt');

// Middleware to verify JWT token and attach user info to req.auth
const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  // The token payload will be available in req.auth
  requestProperty: 'auth'
});

module.exports = authMiddleware;
