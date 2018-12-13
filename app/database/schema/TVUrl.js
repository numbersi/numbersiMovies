const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TVUrlSchema = new Schema({
  title:String,
  TV: {
    type: Schema.ObjectId,
    ref: 'TV'
  },
})
mongoose.model('TVUrl', TVUrlSchema)
