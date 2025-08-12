
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};


module.exports = roleMiddleware;