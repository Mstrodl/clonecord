let errors = {
  unknownAccount: {
    code: 10001,
    message: 'Unknown account'
  },
  unknownApplication: {
    code: 10002,
    message: 'Unknown application'
  },
  unknownChannel: {
    code: 10003,
    message: 'Unknown channel'
  },
  unknownGuild: {
    code: 10004,
    message: 'Unknown guild'
  },
  unknownIntegration: {
    code: 10005,
    message: 'Unknown integration'
  },
  unknownInvite: {
    code: 10006,
    message: 'Unknown invite'
  },
  unknownMember: {
    code: 10007,
    message: 'Unknown member'
  },
  unknownMessage: {
    code: 10008,
    message: 'Unknown message'
  },
  unknownOverwrite: {
    code: 10009,
    message: 'Unknown overwrite'
  },
  unknownProvider: {
    code: 10010,
    message: 'Unknown provider'
  },
  unknownRole: {
    code: 10011,
    message: 'Unknown role'
  },
  unknownToken: {
    code: 10012,
    message: 'Unknown token'
  },
  unknownUser: {
    code: 10013,
    message: 'Unknown user'
  },
  unknownEmoji: {
    code: 10014,
    message: 'Unknown Emoji'
  },
  onlyUsers: {
    code: 20001,
    message: 'Bots cannot use this endpoint'
  },
  onlyBots: {
    code: 20002,
    message: 'Only bots can use this endpoint'
  },
  maxGuilds: {
    code: 30001,
    message: 'Maximum number of guilds reached (100)'
  },
  maxFriends: {
    code: 30002,
    message: 'Maximum number of friends reached (1000)'
  },
  maxPins: {
    code: 30003,
    message: 'Maximum number of pins reached (50)'
  },
  maxRoles: {
    code: 30005,
    message: 'Maximum number of guild roles reached (250)'
  },
  tooManyReactions: {
    code: 30010,
    message: 'Too many reactions'
  },
  unauthorized: {
    code: 40001,
    message: 'Unauthorized'
  },
  missingAccess: {
    code: 50001,
    message: 'Missing access'
  },
  invalidAccountType: {
    code: 50002,
    message: 'Invalid account type'
  },
  execOnDM: {
    code: 50003,
    message: 'Cannot execute action on a DM channel'
  },
  embedDisabled: {
    code: 50004,
    message: 'Embed disabled'
  },
  editMsgByOtherUser: {
    code: 50005,
    message: 'Cannot edit a mesage authored by another user'
  },
  emptyMessage: {
    code: 50006,
    message: 'Cannot send an empty message'
  },
  blocked: {
    code: 50007,
    message: 'Cannot send messages to this user'
  },
  sendInVoice: {
    code: 50008,
    message: 'Cannot send messages in a voice channel'
  },
  verificationTooHigh: {
    code: 50009,
    message: 'Channel verification level is too high'
  },
  applicationHasNoBot: {
    code: 50010,
    message: 'OAuth2 application does not have a bot'
  },
  oauth2Limit: {
    code: 50011,
    message: 'OAuth2 application limit reached'
  },
  oauthState: {
    code: 50012,
    message: 'Invalid OAuth state'
  },
  missingPermissions: {
    code: 50013,
    message: 'Missing permissions'
  },
  invalidToken: {
    code: 50014,
    message: 'Invalid authentication token'
  },
  noteTooLong: {
    code: 50015,
    message: 'Note is too long'
  },
  tooFewManyMessages: {
    code: 50016,
    message: 'Provided too few or too many messages to delete. Must provide at least 2 and fewer than 100 messages to delete.'
  },
  wrongChannelPin: {
    code: 50019,
    message: 'A message can only be pinned to the channel it was sent in'
  },
  execOnSystem: {
    code: 50021,
    message: 'Cannot execute action on a system message'
  },
  tooOldToBulkDelete: {
    code: 50034,
    message: 'A message provided was too old to bulk delete'
  },
  inviteToGuild: {
    code: 50036,
    message: 'An invite was accepted to a guild the application\'s bot is not in'
  },
  reactionBlocked: {
    code: 90001,
    message: 'Reaction Blocked'
  }
}

class ClonecordError extends Error {
  constructor(code) {
    let err
    for(let _e in errors) {
      if(!errors.hasOwnProperty(_e)) continue
      let er = errors[_e]
      if(er.code == code) {
        err = er
        break
      }
    }
    if(!err) throw new Error('Error not found')
    super(err.message)
    this.realError = err
    Error.captureStackTrace(this, ClonecordError)
  }
}

module.exports = {
  Errors: errors,
  ClonecordError: ClonecordError
}