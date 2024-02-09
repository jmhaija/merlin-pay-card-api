import Sessions from '../resources/Sessions.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerMiddleware(app) {
    app.use(async (request, response, next) => {
      let sessionStatus = await Sessions.authenticateSession(request.headers.authorization)

      if (sessionStatus.authenticated) {
        next()
      } else {
        response.status(401).send(HttpJsonInterface.unauthorized(
          'NOT_AUTHENTICATED',
          'The session token could not be authenticated or session is expired'
        ))
      }
    })
  }
}
