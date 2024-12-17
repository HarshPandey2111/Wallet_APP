const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers['authorization'];
  
  // Debug log (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Authorization Header:', authHeader);
  }

  // Extract Bearer token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Token is missing' });
  }

  // Verify JWT token
  try {
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables.');
      return res.status(500).json({ error: 'Server misconfiguration: Missing JWT_SECRET' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request for downstream access
    req.user = decoded;

    // Debug log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Decoded Token:', decoded);
    }

    next();
  } catch (err) {
    // Log invalid token error in development
    console.error('Invalid token:', err.message);

    return res.status(403).json({
      error: 'Access Denied: Invalid or expired token',
    });
  }
};

module.exports = authenticateToken;
