const express = require('express');
const router = express.Router();
const Manifest = require('../models').Manifest;
const manifestList = require('../flat/manifest-list.json');
const verify = require('../verify');
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}`;

router.param('id', (req, res, next, id) => {
  Manifest.findById(id)
    .exec()
    .then(manifest => {
      req.manifest = manifest;
      next();
    }).catch(() => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let query;
  if (req.query.search) {
    const search = req.query.search;
    const regExSearch = new RegExp(search, 'gi');
    query = `name version board revision description download`
    .split(' ')
    .map(key => {
      let q = {}
      q[key] = regExSearch;
      return q;
    });
  }

  Manifest.find({})
    .where({ published: true })
    .or(query)
    .sort('-name')
    .exec()
    .then(list => {
      const result = {options:[]};
      list.reduce((options, manifest) => {
        const { version, board, revision, _id } = manifest;
        const listInfo = {
          version: version,
          board: board,
          revision: revision,
          manifest: `${url}/v2/manifests/${_id}`,
          latest: false
        }
        const option = options.length ? options[options.length - 1] : null;
        if (option && option.name === manifest.name) {
          option.versions.push(listInfo);
          return options;
        } else {
          options.push({
            name: manifest.name,
            versions: [listInfo]
          });
          return options;
        }
      }, result.options);
      res.json(result);
    })
    .catch(err => next(err));
});

/* GET by ID */
router.get('/manifests/:id', (req, res, next) => {
  if (req.manifest.published) return res.json(req.manifest)
  else {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }
});

/* Create new Manifest */
router.post('/manifests', verify(), (req, res, next) => {
  // Add author to manifest
  const manifest = Object.assign(req.body, {author: req.authUser._id});
  new Manifest(manifest).save()
  .then(doc => {
    res.status(201);
    res.json({id: doc._id});
  })
  .catch(err => next(err));
});

/* Update a Manifest */
router.put('/manifests/:id', verify(), (req, res, next) => {
  const manifest = req.manifest;
  // Check authorization
  if (req.authUser._id.toString() === manifest.author.toString() || req.authUser.isAdmin) {
    Object.assign(manifest, req.body);
    manifest.save()
    .then(doc => {
      return res.json(doc);
    })
    .catch(err => next(err));
  } else {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
});

/* Delete a Manifest */
router.delete('/manifests/:id', verify(), (req, res, next) => {
  const manifest = req.manifest;
  // Check authorization
  if (req.authUser._id.toString() === manifest.author.toString() || req.authUser.isAdmin) {
    Manifest.remove(req.manifest)
    .then(doc => res.json({ id: doc._id }))
    .catch(err => next(err));
  } else {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
});

// /* GET microcontroller */
// router.get('/:microcontroller/:firmware/:version', (req, res, next) => {
//   const p = req.params;
//   const microcontroller = p.microcontroller.split('-');
//   const url = `../flat/${microcontroller[0]}/${microcontroller[1]}/${p.firmware}/${p.version}`;
//   res.json(require(url))
// });

// /* GET original api */
// router.get('/:chipset/:revision/:firmware/:version', (req, res, next) => {
//   const p = req.params;
//   const url = `../flat/${p.chipset}/${p.revision}/${p.firmware}/${p.version}`;
//   res.json(require(url))
// })
module.exports = router;
