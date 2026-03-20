const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  return (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token failed' });
    }
  };
};

module.exports = { protect };
