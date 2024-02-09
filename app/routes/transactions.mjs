import Transactions from '../resources/Transactions.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {
    app.get('/transactions', async (request, response) => {
      let transactions

      if (request.query.start && request.query.end) {
        transactions = await Transactions.retrieveTransactionsByDateRange(request.query.start, request.query.end)
      } else {
        transactions = await Transactions.retrieveAllTransactions()
      }

      if(transactions.found) {
        response.status(201).send(HttpJsonInterface.retrieved(
          'RETRIEVED',
          'Transactions were successfully retrieved',
          transactions.object
        ))
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })

    app.post('/transactions', async (request, response) => {
      let transactionResult = await Transactions.createTransaction(request.body.transaction)

      if (transactionResult.approved) {
        response.status(201).send(HttpJsonInterface.created(
          'APPROVED',
          'Transaction was successfully created',
          transactionResult.object
        ))
      } else if (transactionResult.malformed) {
        response.status(400).send(HttpJsonInterface.malformed(
          'BAD_TRANSACTION_DATA',
          'The supplied transaction data is either incomplete or malformed'
        ))
      } else if (transactionResult.notfound) {
        response.status(404).send(HttpJsonInterface.notfound(
          'NO_SUCH_ACCOUNT',
          'The account does not exist, transaction cannot be completed'
        ))
      } else if (transactionResult.declined && transactionResult.reason === 'LIMIT') {
        response.status(402).send(HttpJsonInterface.notfound(
          'DECLINED_LIMIT',
          'Transaction could not be completed due to amount being over the maximum or under the minimum allowed limits'
        ))
      } else if (transactionResult.declined && transactionResult.reason === 'NSF') {
        response.status(402).send(HttpJsonInterface.notfound(
          'DECLINED_NSF',
          'Transaction could not be completed due to non sufficient funds in the account'
        ))
      }
    })
  }
}
