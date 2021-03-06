const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayUrlSchema =new Schema({
  raw_url: String, // ticket
  play_url: String,
  expires_in: Number,
})

const PlayUrlModel = mongoose.model('PlayUrl',PlayUrlSchema)
module.exports =PlayUrlModel
