var express = require('express');
var router = express.Router();
const manifestList = require('../flat/manifest-list.json');

router.param('version', (req, res, next, m) => {
  next();
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(manifestList);
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
