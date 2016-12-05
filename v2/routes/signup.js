const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const secret = require('../config').auth.secret;
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}`;

const unauthorized = (message) => {
  const err = new Error(message || 'Unauthorized');
  err.status = 401;
  return err;
}

function handOutToken(user) {
  const token = jwt.sign({ id: user._id, exp: Date.now() + 15 * 60 * 1000}, secret);
  return {
    caveat: "This should be sent in an email, but anyway, click on this link in the next 15 min to verify your account.",
    link: `${url}/v2/signup/${token}`,
    email: user.username
  };
}

/* Sign up for user account */
router.post('/', (req, res, next) => {
  User.findOne({username:req.body.username})
  .then(user => {
    if (user === null) return new User(req.body).save();
    else {
      if (user.verified) {
        const err = new Error('User already exists');
        err.status = 409;
        throw err;
      }
      return user;
    }
  })
  .then(handOutToken)
  .then(json => res.json(json))
  .catch(err=>next(err));
});

/* Verify user account */
router.get('/:jwt', (req, res, next) => {
  jwt.verify(req.params.jwt, secret, (err, decoded) => {
    if (err) return next(err);
    if (decoded.exp < Date.now()) {
      return next(unauthorized('Expired token'));
    }
    User.findById(decoded.id).exec()
    .then(user => {
      if (user.verified) throw new Error('Already verified');
      user.verified = true;
      return user.save();
    })
    .then(user => res.json({message: `Congratulations, ${user.fName}, your account is now verified!`}))
    .catch(err => next(err));
  });
});

module.exports = router;