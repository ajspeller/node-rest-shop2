const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const secret = process.env.JWT_KEY;
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    req.userData = decoded;
    next(); // successful authentication
  } catch (e) {
    return res.status(401).json({
      message: 'Authentication Failed',
    });
  }
};
