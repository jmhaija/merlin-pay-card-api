import Authentications from '../resources/Authentications.mjs'
import Sessions from '../resources/Sessions.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {
    app.post('/sessions', async (request, response) => {
      let authResult = await Authentications.authenticateSession(request.body.context, request.body.credentials)

      if (authResult.authenticated) {
        response.status(201).send(HttpJsonInterface.created(
          'AUTHENTICATED',
          'The session was successfully authenticated',
          authResult.sessionResources
        ))
      } else {
        response.status(401).send(HttpJsonInterface.unauthorized(
          'NOT_AUTHENTICATED',
          'Either the context or the credentials of the client could not be authenticated'
        ))
      }
    })

    app.delete('/sessions/:id', async(request, response) => {
      Sessions.terminateSession(request.params.id)
      
      response.status(200).send(HttpJsonInterface.deleted(
        'SESSION_ENDED',
        'The session was successfully terminated'
      ))      
    })
  }
}
