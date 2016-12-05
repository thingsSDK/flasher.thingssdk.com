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

/* GET home page. */
router.get('/', function(req, res, next) {
  User.findOne({
    username: req.un
  })
  .exec()
  .then(user => {
    if (!user.verified) {
      const err = new Error('Unverified Account');
      err.status = 401;
      throw err;
    }
    user.comparePassword(req.pw, (err, isMatch) =>{
      if (err) next(err);
      const token = jwt.sign({ id: user._id, exp: Date.now() + 2 * 60 * 60 * 1000}, secret);
      res.json({access_token:token});
    })
  })
  .catch(err => next(err));
});

module.exports = router;
