let mongoose = require("mongoose")

let channelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  guildID: {
    type: String,
    required: true
  },
  topic: String,
  type: {
    type: String,
    default: "text"
  },
  position: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: "general"
  }
})

let Channel = mongoose.model("channel", channelSchema)

module.exports = Channel
