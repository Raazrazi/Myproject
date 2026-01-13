const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, default: "" }
});

module.exports = mongoose.model('Member', memberSchema);