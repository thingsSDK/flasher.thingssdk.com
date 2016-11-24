const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ManifestSchema = new Schema({
  name: String,
  version: String,
  board: String,
  revision: String,
  description: String,
  download: String,
  flash: [{
      address: String,
      path: String
  }],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  published: {type: Boolean, default: false}
});

// ManifestSchema.method("", () => {
// });

// ManifestSchema.method("", () => {
// });

// ManifestSchema.pre("save", next => {
//   next();
// });

const Manifest = mongoose.model("Manifest", ManifestSchema);

module.exports.Manifest = Manifest;













