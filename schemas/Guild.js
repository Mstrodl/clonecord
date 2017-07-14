let mongoose = require("mongoose")

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
})

let Guild = mongoose.model("guild", guildSchema)

module.exports = Guild
