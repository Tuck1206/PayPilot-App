const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
  billname: {
  type: String,
    required: true,
  },
   amount: {
  type: String,
    required: true,
  },
   duedate: {
  type: Date,
    required: true,
  },
  status: {
  type: String,
    ispaid: Boolean,
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
   bills: [billSchema]
})

const User = mongoose.model('User', userSchema)

module.exports = User
