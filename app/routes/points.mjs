import Accounts from '../resources/Accounts.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {
    app.post('/points', async (request, response) => {
      let pointsAccount = await Accounts.addLoyaltyPoints(request.body.id, request.body.amount)

      if (pointsAccount.updated) {
        response.status(201).send(HttpJsonInterface.created(
          'POINTS_ADDED',
          'Loyalty points successfully added to account',
          pointsAccount.object
        ))
      } else if (newAccount.notfound) {
        response.status(404).send(HttpJsonInterface.conflict(
          'NOT_FOUND',
          'Could not add points to non-existing account'
        ))
      } else {
        response.status(400).send(HttpJsonInterface.error())
      }
    })
  }
}
