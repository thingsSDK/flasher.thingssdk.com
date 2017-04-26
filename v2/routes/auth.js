const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const secret = require('../config').auth.secret;

router.use((req, res, next) => {
  const cred = req.get('Authorization');
  if (!cred) {
    const err = new Error('Authorization failed');
    err.status = 401;
    return next(err);
  }
  const parsedCred = Buffer.from(cred, 'base64').toString().split(':');
  req.un = parsedCred[0];
  req.pw = parsedCred[1];
  next();
});

/* GET auth token */
router.get('/authorize', function(req, res, next) {
  User.findOne({
    username: req.un
  })
  .select('+password')
  .exec()
  .then(user => {
    if (!user) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
    if (!user.verified) {
      const err = new Error('Unverified Account');
      err.status = 401;
      return next(err);
    }
    user.comparePassword(req.pw, (err, isMatch) =>{
      if (err) return next(err);
      if (!isMatch) {
        const err = new Error('Forbidden')
        err.status = 403
        return next(err)
      }
      const token = jwt.sign({ id: user._id, exp: Date.now() + 2 * 60 * 60 * 1000}, secret);
      res.json({access_token:token});
    })
  })
  .catch(err => next(err));
});

module.exports = router;
