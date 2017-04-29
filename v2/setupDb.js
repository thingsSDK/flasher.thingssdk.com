if (process.argv.length < 4) throw new Error('Must provide a database and an action');

const db = process.argv[2];
const action = process.argv[3];

const actions = {
  up: () => {
    const users = require('./dummy/users.json');
    const manifests = require('./dummy/manifests.json');
    Promise.all(users.map(user => new User(user).save()))
    .then((users) => {
      users = users.reduce((result, user) => {
        result[user.fName] = user;
        return result;
      }, {});
      return Promise.all(manifests.map((manifest, index, arr) => {
        const man = new Manifest(manifest);
        if (index < 3) {
          man.author = users.Josefin._id;
        } else {
          man.author = users.Molly._id;
        }
        man.published = (index % 2 === 0);
        return new Manifest(man).save()
      }))
    })
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
const User = require('./models').User;
mongoose.connect(`mongodb://localhost:27017/${db}`);

mongoose.connection.on('open', () => actions[action]())