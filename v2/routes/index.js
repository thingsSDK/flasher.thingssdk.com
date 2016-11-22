var express = require('express');
var router = express.Router();
const manifestList = require('../flat/manifest-list.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(manifestList);
});

router.get('/:chipset/:revision/:firmware/:version', (req, res, next) => {
  res.json({
    chipset: req.params.chipset,
    revision: req.params.revision,
    firmware: req.params.firmware,
    version: req.params.version,
  })
});

module.exports = router;
