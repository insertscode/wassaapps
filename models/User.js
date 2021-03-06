const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  displayName:  { type: String, required: true },
  googleId:     { type: String, required: true },
  background:   { type: String, required: true},
  image:        { type: String },
  flashId:      { type: String, required: false},
  createdAt:    { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', UserSchema)
