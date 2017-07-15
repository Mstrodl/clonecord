let mongoose = require("mongoose")

/*let messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
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
})*/
let messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  },
  author: {
    type: Object,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  edited_timestamp: Date,
  tts: {
    type: Boolean,
    default: false
  },
  mention_everyone: Boolean,
  mentions: {
    type: Array,
    default: []
  },
  mention_roles: {
    type: Array,
    default: []
  },
  attachments: {
    type: Array,
    default: []
  },
  embeds: {
    type: Array,
    default: []
  },
  reactions: {
    type: Array,
    default: []
  },
  nonce: {
    type: String,
    required: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  webhook_id: {
    type: String,
    required: false
  }
})
messageSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  }
})

let Message = mongoose.model("message", messageSchema)

module.exports = Message
