const express = require('express');
const router = express.Router();
const Manifest = require('../models').Manifest;
const manifestList = require('../flat/manifest-list.json');
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
  Manifest.find({})
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
          manifest: `${url}/v2/${_id}`,
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
router.get('/manifests/:id', (req, res, next) => res.json(req.manifest));

/* Create new Manifest */
router.post('/manifests', (req, res, next) => {
  new Manifest(req.body).save()
  .then(doc => {
    res.status(201);
    res.json({id: doc._id});
  })
  .catch(err => next(err));
});

/* Update a Manifest */
router.put('/manifests/:id', (req, res, next) => {
  const manifest = req.manifest;
  Object.assign(manifest, req.body);
  manifest.save()
  .then(doc => {
    res.json(doc);
  })
  .catch(err => next(err));
});

/* Delete a Manifest */
router.delete('/manifests/:id', (req, res, next) => {
  Manifest.remove(req.manifest)
  .then(doc => {
    res.json({id: doc._id});
  })
  .catch(err => next(err));
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
