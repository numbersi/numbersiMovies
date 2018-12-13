const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TVSchema = new Schema({
  title:String,
  tvUrl: [{
    type: Schema.ObjectId,
    ref: 'TVUrl'
  }]
})
mongoose.model('TV', TVSchema)
