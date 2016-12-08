const express = require('express');
const router = express.Router();
const User = require('../models').User;

// Only admins can use these routes
router.use((req, res, next) => {
  if (!req.authorizedUser || !req.authorizedUser.isAdmin) {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
  return next();
});

router.param('id', (req, res, next, id) => {
  User.findById(id)
    .exec()
    .then(user => {
      req.user = user;
      next();
    }).catch(() => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
});

/* GET all users. */
router.get('/', function(req, res, next) {
  User.find({})
    .sort('-username')
    .exec()
    .then(list => {
      res.json({ data: list });
    })
    .catch(err => next(err));
});

/* Create new User */
router.post('/', (req, res, next) => {
  new User(req.body).save()
  .then(doc => {
    res.status(201);
    res.json({id: doc._id});
  })
  .catch(err => next(err));
});

/* GET by ID */
router.get('/:id', (req, res, next) => {
  return res.json(req.user);
});

/* Update a User */
router.put('/:id', (req, res, next) => {
  const user = req.user;
  Object.assign(user, req.body);
  user.save()
  .then(doc => {
    res.json(doc);
  })
  .catch(err => next(err));
});

/* Delete a User */
router.delete('/:id', (req, res, next) => {
  User.remove(req.user)
  .then(doc => {
    res.json({id: doc._id});
  })
  .catch(err => next(err));
});

module.exports = router;
