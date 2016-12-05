const jwt = require('jsonwebtoken');
const secret = require('./config').auth.secret;
const User = require('./models').User;

const unauthorized = (message) => {
  const err = new Error(message || 'Unauthorized');
  err.status = 401;
  return err;
}

module.exports = adminStatus => {
  return (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || authHeader.search('Bearer: ') !== 0) return next(unauthorized());
    const token = authHeader.replace('Bearer: ', '');
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return next(err);
      }
      if (decoded.exp < Date.now()) {
        return next(unauthorized('Expired token'))
      }
      User.findById(decoded.id).exec()
      .then(user => {
        if(user) {
          req.authUser = user;
          if (adminStatus) {
            if (user.isAdmin) return next();
            return next(unauthorized());
          }
          return next();
        } else {
          return next(unauthorized());
        }
      })
      .catch(err => next(err))
    })
  };
};