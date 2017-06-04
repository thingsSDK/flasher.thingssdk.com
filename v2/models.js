const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const secret = require('./config').auth.secret;

const ManifestSchema = new Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  board: { type: String, required: true },
  revision: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  download: { type: String, required: true },
  flash: {
    frequency: { type: String, required: true },
    images: [{
      address: { type: String, required: true },
      path: { type: String, required: true },
      sha: {type: String, required: true}
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
});

const UserSchema = new Schema({
  fName: String,
  lName: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false },
  twitter: String,
  github: String,
  avatarUrl: String,
  verified: { type: Boolean, default: false }
});

UserSchema.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
}

UserSchema.statics.loadFromToken = function(raw) {
  if (!raw || raw.search('Bearer: ') !== 0) return Promise.resolve(null);
  const token = raw.replace('Bearer: ', '');
  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.resolve(null);
  }
  if (decoded.exp < Date.now()) {
    return Promise.resolve(null);
  }
  return this.findById(decoded.id).select('+password').exec()
  .then(user => user)
  .catch(err => {
    console.error('User static method loadFromToken failed.');
    return null;
  });
}


module.exports.Manifest = mongoose.model("Manifest", ManifestSchema);
module.exports.User = mongoose.model("User", UserSchema);













