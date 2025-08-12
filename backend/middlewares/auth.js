const { verifyToken } = require('../config/jwt');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Authentication required');

    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth ;