import settings from '../config/settings.mjs'
import PersistService from '../services/PersistService.mjs'

const sessionIsValid = sessionObject => {
  return sessionObject.session_expires > Date.now()
}

const updateSession = (sessionObject) => {
  sessionObject.session_expires = Date.now() + settings.session.sessionLife
  PersistService.updateOne('sessions', sessionObject.id, sessionObject)
}

const deleteSession = (sessionID) => {
  PersistService.deleteOne('sessions', {
    session_id: sessionID
  })
}

export default {
  async authenticateSession(header) {
    if (header) {
      const headerParts = header.split(' ')
      const type = headerParts[0]
      const token = headerParts[1]

      let session = await PersistService.findOne('sessions', {
        session_token: token
      })

      if (!session.isEmpty &&
          type === 'Bearer' &&
          sessionIsValid(session.object))
      {
        updateSession(session.object)
        return {
          authenticated: true
        }
      }
    }

    deleteSession(session.object)
    return {
      authenticated: false
    }
  },

  async terminateSession(id) {
    deleteSession(id)
    return {
      deleted: true
    }
  }
}
