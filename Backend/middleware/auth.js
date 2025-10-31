 const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token,process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    console.log("✅ Decoded token:", user); 
    console.log("token",token);
    req.user = user; // attach user payload (e.g., { id: ..., email: ... })
    next();
  });
};

module.exports = verifyToken; 


