const express = require('express');
const router = express.Router();
const Manifest = require('../models').Manifest;
const manifestList = require('../flat/manifest-list.json');
const port = process.env.PORT || 3000;
const url = process.env.URL || `http://localhost:${port}`;

/* GET home page. */
router.get('/', function(req, res, next) {
  Manifest.find({})
    .sort('-name')
    .exec()
    .then(list => {
      const result = {options:[]};
      list.reduce((options, manifest) => {
        const { version, board, revision, name } = manifest;
        const listInfo = {
          version: version,
          board: board,
          revision: revision,
          manifest: `${url}/v2/${board}/${revision.replace('-','')}/${name}/HOW-TO-REF-THIS-FROM-MANIFEST?`, // http://flasher.thingssdk.com/v1/esp8266/esp12/espruino/manifest.1.88.json,
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

/* GET microcontroller */
router.get('/:microcontroller/:firmware/:version', (req, res, next) => {
  const p = req.params;
  const microcontroller = p.microcontroller.split('-');
  const url = `../flat/${microcontroller[0]}/${microcontroller[1]}/${p.firmware}/${p.version}`;
  res.json(require(url))
});

/* GET original api */
router.get('/:chipset/:revision/:firmware/:version', (req, res, next) => {
  const p = req.params;
  const url = `../flat/${p.chipset}/${p.revision}/${p.firmware}/${p.version}`;
  res.json(require(url))
})
module.exports = router;
