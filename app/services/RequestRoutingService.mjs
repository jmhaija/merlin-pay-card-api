import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import settings from '../config/settings.mjs'
import authentications from '../routes/authentications.mjs'
import sessions from '../middleware/sessions.mjs'
import accounts from '../routes/accounts.mjs'
import customers from '../routes/customers.mjs'
import transactions from '../routes/transactions.mjs'
import points from '../routes/points.mjs'
import spire from '../routes/spire.mjs'

export default {
  start() {
    const app = express()
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(cors())
    app.use(morgan('combined'))

    authentications.registerRoutes(app)
    sessions.registerMiddleware(app)
    accounts.registerRoutes(app)
    customers.registerRoutes(app)
    transactions.registerRoutes(app)
    points.registerRoutes(app)
    spire.registerRoutes(app)

    app.listen(settings.server.port, function () {
      console.log(`${settings.server.name} listening on port ${settings.server.port}...`)
    })
  }
}
