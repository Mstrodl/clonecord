let mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  discriminator: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  guilds: {
    type: Array,
    default: []
  },
  premium: { // Nitro
    type: Boolean,
    default: false
  },
  password: { // pls hash this kthx
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  bot: {
    type: Boolean,
    default: false
  }
})

let User = mongoose.model("user", userSchema)

module.exports = User
