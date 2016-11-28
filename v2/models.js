const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const ManifestSchema = new Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  board: { type: String, required: true },
  revision: { type: String, required: true },
  description: { type: String, required: true },
  download: { type: String, required: true },
  flash: [{
      address: { type: String, required: true },
      path: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
});

const UserSchema = new Schema({
  fName: String,
  lName: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  twitter: String,
  github: String,
  avatarUrl: String
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
// ManifestSchema.method("", () => {
// });

// ManifestSchema.method("", () => {
// });

// ManifestSchema.pre("save", next => {
//   next();
// });


module.exports.Manifest = mongoose.model("Manifest", ManifestSchema);
module.exports.User = mongoose.model("User", UserSchema);













