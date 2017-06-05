const express = require('express');
const router = express.Router();
const User = require('../models').User;

const filterObj = require('../util').filterObject;

router.use((req, res, next) => {
  if(req.authorizedUser) return next();
  const err = new Error('Unauthorized');
  err.status = 401;
  return next(err);
});

router.get('/my-account', (req, res, next) => {
  const userObj = req.authorizedUser.toObject()
   const infoToSend = filterObj(['__v', '_id', 'password'], userObj)
  return res.json(infoToSend);
});

router.put('/my-account', (req, res, next) => {
  if(!req.authorizedUser.isAdmin) Object.assign(req.body, {isAdmin: false});
  Object.assign(req.authorizedUser, req.body);
  req.authorizedUser.save()
  .then(user => res.json(user))
  .catch(err => next(err));
});

router.delete('/my-account', (req, res, next) => {
  User.remove(req.authorizedUser)
  .then(user => res.json({message: 'success'}))
  .catch(err => next(err));
});

module.exports = router;
