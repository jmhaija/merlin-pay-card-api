import Accounts from '../resources/Accounts.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {
    app.post('/accounts', async (request, response) => {
      let newAccount = await Accounts.createAccount(request.body.account)

      if (newAccount.created) {
        response.status(201).send(HttpJsonInterface.created(
          'CREATED',
          'Account was successfully created',
          newAccount.object
        ))
      } else if (newAccount.malformed) {
        response.status(400).send(HttpJsonInterface.malformed())
      } else if (newAccount.conflict) {
        response.status(409).send(HttpJsonInterface.conflict(
          'CARD_EXISTS',
          'The card you tried to register already exists',
          newAccount.existingAccountObject
        ))
      } else {
        response.status(400).send(HttpJsonInterface.error())
      }
    })

    app.get('/accounts', async (request, response) => {
      if(request.query.join) {
        let accounts_customers = await Accounts.retrieveAccountsJoinedWithCustomers()
        if(accounts_customers.object) {
          response.status(200).send(HttpJsonInterface.retrieved(
            'RETRIEVED',
            'Accounts with associated customer data were successfully retrieved',
            accounts_customers.object
          ))
        } else {
          response.status(404).send(HttpJsonInterface.notfound())
        }
        return
      }
      if (Object.keys(request.query).length > 0) {
          let account = await Accounts.retrieveAccountByCardNumber(request.query.account_card)

          if(account.object) {
            response.status(201).send(HttpJsonInterface.retrieved(
              'RETRIEVED',
              'Account collection was successfully retrieved',
              account.object
            ))
          } else {
            response.status(404).send(HttpJsonInterface.notfound())
          }
      } else {
        let allAccounts = await Accounts.retrieveAllAccounts()

        if (allAccounts.object) {
          response.status(201).send(HttpJsonInterface.retrieved(
          'RETRIEVED',
          'Account collection was successfully retrieved',
          allAccounts.object
          ))
        } else {
          response.status(404).send(HttpJsonInterface.notfound())
        }
      }
    })

    app.get('/accounts/:id', async (request, response) => {
      let fetchedAccount = await Accounts.retrieveAccount(request.params.id)

      if (fetchedAccount.found) {
        response.status(200).send(HttpJsonInterface.retrieved(
          'RETRIEVED',
          'Account was successfully retrieved',
          fetchedAccount.object
        ))
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })

    app.patch('/accounts/:id', async(request, response) => {
      let updateBody = request.body
      let updatedAccount = await Accounts.updateAccount(request.params.id, updateBody)

      if(updatedAccount.updated) {
        response.status(200).send(HttpJsonInterface.updated(
          'UPDATED',
          'Account was successfully updated',
          updatedAccount.object
        ))
      } else if (updatedAccount.malformed) {
        response.status(400).send(HttpJsonInterface.malformed()) 
      } else {
        response.status(400).send(HttpJsonInterface.error())
      }
    })
  }
}
