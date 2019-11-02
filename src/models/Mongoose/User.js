const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    fname: {
      type: String,
      required: true
    },
    mname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true
  },
  apiToken: {
    type: String,
    required: true
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
},
{
  timestamps: true
})

module.exports = model('user', userSchema)
