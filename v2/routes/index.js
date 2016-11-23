var express = require('express');
var router = express.Router();
const manifestList = require('../flat/manifest-list.json');

router.param('version', (req, res, next, m) => {
  // console.log('micro:',m);
  next();
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(manifestList);
});

router.get('/:microcontroller/:firmware/:version', (req, res, next) => {
  res.json({
    microcontroller: req.params.microcontroller,
    firmware: req.params.firmware,
    version: req.params.version
  })
});

router.get('/:chipset/:revision/:firmware/:version', (req, res, next) => {
  res.json({
    chipset: req.params.chipset,
    revision: req.params.revision,
    firmware: req.params.firmware,
    version: req.params.version
  })
})
module.exports = router;
