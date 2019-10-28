const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('product', productSchema)
