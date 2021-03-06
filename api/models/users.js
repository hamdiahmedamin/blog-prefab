'use strict'

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
  name:         { type: String, required: true },
  password:     { type: String, required: true },
  accessLevel:   { type: Number, required: true }
})

module.exports = mongoose.model('User', UserSchema);
