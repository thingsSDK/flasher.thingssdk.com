const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const secret = require('../config').auth.secret;

const auth = require('basic-auth');
const createStatusError = require('../utils/createStatusError');

const unauthorizedError = createStatusError(401);
const unprocessibleEntityError = createStatusError(422);

router.use((req, res, next) => {
  const cred = auth(req);
  if (!cred) {
    return next(unauthorizedError);
  }
  req.un = cred.name;
  req.pw = cred.pass;
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
    if (!user) return next(unprocessibleEntityError);
    if (!user.verified) {
      const err = new Error('Unverified Account');
      err.status = 401;
      return next(err);
    }
    user.comparePassword(req.pw, (err, isMatch) =>{
      if (err) return next(err);
      if (!isMatch) return next(unprocessibleEntityError);
      const token = jwt.sign({ id: user._id, exp: Date.now() + 2 * 60 * 60 * 1000}, secret);
      res.json({access_token:token});
    })
  })
  .catch(err => next(err));
});

module.exports = router;
