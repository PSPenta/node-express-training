const { Schema, model } = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

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
      required: false
    },
    lname: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
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
});

userSchema.plugin(aggregatePaginate);
module.exports = model('user', userSchema)
