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
  bot: {
    type: Boolean,
    default: false
  },
  guilds: {
    type: Array,
    default: []
  },
  flags: { // Flags of the user. like if they are staff or not or hypesquad
    type: Array,
    default: []
  },
  premium: { // Nitro
    type: Boolean,
    default: false
  },
  password: { // pls hash this kthx
    type: Object,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    required: false,
    default: false
  },
  verified: Boolean
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  }
})

let User = mongoose.model("user", userSchema)

module.exports = User
