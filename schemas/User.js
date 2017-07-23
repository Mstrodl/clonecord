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
  mfa_enabled: {
    type: Boolean,
    default: false
  },
  private_channels: {
    type: Array,
    default: []
  },
  notes: {
    type: Array,
    default: []
  },
  relationships: {
    type: Array,
    default: []
  },
  settings: {
    type: Object,
    default: {
      locale: 'en-US',
      status: 'online',
      showCurrentGame: true,
      sync: true,
      inlineAttachmentMedia: true,
      inlineEmbedMedia: true,
      renderEmbeds: true,
      renderReations: true,
      theme: 'dark',
      enableTTSCommand: true,
      messageDisaplyCompact: false,
      convertEmoticons: true,
      restrictedGuilds: [],
      defaultGuildsRestricted: false,
      explicitContentFilter: 0,
      friendSourceFlags: {all: true},
      developerMode: true,
      guildPositions: [],
      detectPlatformAccounts: false,
      afkTimeout: 600
    }
  },
  guild_settings: {
    type: Array,
    default: []
  },
  verified: Boolean
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
    delete ret.admin
    delete ret.password
    delete ret.guilds
    delete ret.flags
    delete ret.premium
    delete ret.private_channels
    delete ret.notes
    delete ret.relationships
    delete ret.settings
  }
})

let User = mongoose.model("user", userSchema)

module.exports = User
