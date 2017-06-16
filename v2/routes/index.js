const express = require('express');
const router = express.Router();
const Manifest = require('../models').Manifest;
const manifestList = require('../flat/manifest-list.json');
// const verify = require('../verify');
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

function isAuthorized(req, mustBeUser) {
  const doc = req.manifest;
  const user = req.authorizedUser;
  if (mustBeUser && !user) return false; 
  return doc.published || user && (user.isAdmin || user._id.toString() === doc.author.toString());
}

function preserveUnpublished(req) {
  if (!req.authorizedUser || !req.authorizedUser.isAdmin) req.body.published = false;
}

// TODO fail request from invalid Auth headers
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get init')
  let fieldsToSearch;
  if (req.query.search) {
    const search = req.query.search;
    const regExSearch = new RegExp(search, 'gi');
    fieldsToSearch = `name version board revision description download`
    .split(' ')
    .map(key => {
      let q = {}
      q[key] = regExSearch;
      return q;
    });
  }

  const checkForAuthorship = (authorizedUser, authorID) => {
    if (!authorizedUser) {
      return false
    }
    return authorizedUser._id && authorizedUser._id.toString() === authorID.toString()
  }
  const manifestQuery = Manifest.find({});
  if (req.authorizedUser && !req.authorizedUser.isAdmin) {
    manifestQuery.or([{published:true}, {author:req.authorizedUser._id}])
  } else if (!req.authorizedUser) {
    manifestQuery.where({ published: true })
  }
  if (fieldsToSearch) {
    manifestQuery.or(fieldsToSearch)
  }
  manifestQuery.sort('name')
    .exec()
    .then(list => {
      const result = {options:[]};
      list.reduce((options, manifest) => {
        const { version, board, revision, _id, author, published } = manifest;
        const listInfo = {
          version,
          board,
          revision,
          published,
          isAuthor: checkForAuthorship(req.authorizedUser, author.toString()),
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
  if (isAuthorized(req)) return res.json(req.manifest)
  else {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }
});

/* Create new Manifest */
router.post('/manifests', (req, res, next) => {
  if (!req.authorizedUser) {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
  // Add author to manifest, assure unpublished status
  Object.assign(req.body, {author: req.authorizedUser._id, published: false});
  new Manifest(req.body).save()
  .then(doc => {
    res.status(201);
    res.json({ message: 'Success'});
  })
  .catch(err => next(err));
});

/* Update a Manifest */
router.put('/manifests/:id', (req, res, next) => {
  const manifest = req.manifest;
  // Check authorization
  if (isAuthorized(req, true)) {
    if (!manifest.published) preserveUnpublished(req);
    Object.assign(manifest, req.body);
    manifest.save()
    .then(doc => {
      return res.json({ message: 'Success'});
    })
    .catch(err => next(err));
  } else {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
});

/* Delete a Manifest */
router.delete('/manifests/:id', (req, res, next) => {
  const manifest = req.manifest;
  // Check authorization
  if (isAuthorized(req, true)) {
    Manifest.remove(req.manifest)
    .then(doc => res.json({ message: 'Success'}))
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
