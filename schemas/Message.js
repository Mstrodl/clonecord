let mongoose = require("mongoose")

let messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
    required: true
  },
  content: {
    type: String,
    default: "",
    required: true
  },
  author: {
    type: String,
    required: true
  },
  channelID: {
    type: String,
    required: true
  },
  embeds: {
    type: Array,
    default: []
  }
})

let Message = mongoose.model("message", messageSchema)

module.exports = Message
