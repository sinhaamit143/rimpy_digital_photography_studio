const { verifyAccessToken } = require('../utils/jwt.util');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Access token expired or invalid' });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
