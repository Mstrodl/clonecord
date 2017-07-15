let mongoose = require("mongoose")

/*let guildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  icon: String,
  splash: String,
  region: {
    type: String,
    default: "us-east"
  },
  features: {
    type: Array,
    default: []
  },
  afkTimeout: {
    type: Number,
    default: 0
  },
  embedEnabled: {
    type: Boolean,
    default: false
  },
  verificationLevel: {
    type: Number,
    default: 0
  },
  explicitContentFilter: {
    type: Boolean,
    default: false
  },
  ownerID: {
    type: String,
    required: true
  }
})*/
let guildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  icon: String,
  splash: String,
  owner_id: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true,
    default: 'us-east'
  },
  afk_channel_id: String,
  afk_timeout: Number,
  embed_enabled: Boolean,
  embed_channel_id: String,
  verification_level: {
    type: Number,
    default: 0
  },
  default_message_notifications: {
    type: Number,
    default: 0
  },
  roles: {
    type: Array,
    default: []
  },
  emojis: {
    type: Array,
    default: []
  },
  features: {
    type: Array,
    default: []
  },
  mfa_level: {
    type: Number,
    default: 0
  },
  joined_at: {
    type: Date
  },
  large: {
    type: Boolean,
    default: false
  },
  unavailable: {
    type: Boolean,
    default: false
  },
  member_count: {
    type: Number,
    default: 0
  },
  voice_stats: {
    type: Array,
    default: []
  },
  members: {
    type: Array,
    default: []
  },
  channels: {
    type: Array,
    default: []
  },
  presences: {
    type: Array,
    default: []
  }
})
guildSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  }
})

let Guild = mongoose.model("guild", guildSchema)

module.exports = Guild
