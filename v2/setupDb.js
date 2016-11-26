if (process.argv.length < 4) throw new Error('Must provide a database and an action');

const db = process.argv[2];
const action = process.argv[3];

const actions = {
  up: () => {
    Promise.all([5,6,7,8].map(num => new Manifest(require(`./flat/esp8266/esp12/espruino/manifest.1.8${num}.json`)).save()))
    .then(()=> new Manifest(require('./flat/esp8266/esp12/smartjs/manifest.json')).save())
    .then(() => {
      process.stdout.write(`Database ${db} has been updated.\n`);
      process.exit();
    })
    .catch(err=>{throw err});
  },
  down: () => {
    Manifest.db.dropDatabase()
    .then(()=> {
      process.stdout.write(`Database ${db} has been dropped.\n`);
      process.exit();
    })
    .catch(err=>{throw err});
  }
}

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Manifest = require('./models').Manifest;
mongoose.connect(`mongodb://localhost:27017/${db}`);

mongoose.connection.on('open', () => actions[action]())