const { verify } = require('jsonwebtoken');

function isAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next();  // No token, proceed without attaching user
  }

  try {
    const data = verify(token, process.env.JWT_SECRET);
    req.user = data;  // Attach decoded user data to req.user
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    next();
  }
}

module.exports = { isAuth };
