let mongoose = require("mongoose")

let channelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  guild_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'general',
    required: true,
    maxlength: 100,
    minlength: 2
  },
  type: {
    type: String,
    default: 'text'
  },
  position: {
    type: Number,
    default: 0
  },
  is_private: {
    type: Boolean,
    default: false
  },
  permission_overwrites: {
    type: Array,
    default: []
  },
  topic: {
    type: String,
    minlength: 0,
    maxlength: 1024
  },
  last_message_id: {
    type: String
  },
  bitrate: {
    type: Number,
    required: false,
  },
  user_limit: {
    type: Number,
    required: false
  }
})

channelSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  }
})

let Channel = mongoose.model("channel", channelSchema)

module.exports = Channel
