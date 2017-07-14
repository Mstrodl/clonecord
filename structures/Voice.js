
class VoiceRegion {
  constructor(options) {
    this.options = options
    this.name = options.name
    this.deprecated = options.deprecated
    this.custom = options.custom
    this.vip = options.vip
    this.optimal = options.optimal
    this.id = options.id
  }
  toJSON() {
    return {
      name: this.name,
      deprecated: this.deprecated,
      custom: this.custom,
      vip: this.vip,
      optimal: this.optimal,
      id: this.id
    }
  }
}
class VoiceManager {
  constructor() {
    this.regions = []
    this.regions.push(new VoiceRegion({
      name: 'Custom',
      deprecated: false,
      custom: true,
      vip: false,
      optimal: false,
      id: 'meme'
    }))
    this.regions.push(new VoiceRegion({
      name: 'VIP',
      deprecated: false,
      custom: false,
      vip: true,
      optimal: false,
      id: 'vip'
    }))
    this.regions.push(new VoiceRegion({
      name: 'US East (Optimal)',
      deprecated: false,
      custom: false,
      vip: false,
      optimal: true,
      id: 'us-east'
    }))
    this.regions.push(new VoiceRegion({
      name: 'Deprecated',
      deprecated: true,
      custom: false,
      vip: false,
      optimal: false,
      id: 'deprecated'
    }))
  }
}
module.exports = {
  VoiceRegion: VoiceRegion,
  VoiceManager: VoiceManager
}