const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MovieSchema = new Schema({
  source: String,
  wd:String,
  ids:String,
  title: String,
})
mongoose.model('Movie', MovieSchema)
