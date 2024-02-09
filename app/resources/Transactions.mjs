import settings from '../config/settings.mjs'
import PersistService from '../services/PersistService.mjs'
import crypto from 'crypto'

const mutateAccount = {
  debit(account, amount) {
    if (amount > account.account_balance) {
      return {
        ok: false,
        declineReason: 'NSF'
      }
    }

    account.account_balance -= (amount + settings.transactions.debitFee)
    account.account_points += (amount * settings.loyalty.pointMultiple)
    account.account_modified_at = Date.now()

    return {
      ok: true,
      accountObject: account
    }
  },

  credit(account, amount) {
    account.account_balance += (amount - settings.transactions.creditFee)
    account.account_modified_at = Date.now()

    return {
      ok: true,
      accountObject: account
    }
  }
}

export default {
  async createTransaction(transactionDefinition) {
    if (!transactionDefinition.transaction_type ||
        !transactionDefinition.transaction_amount ||
        !transactionDefinition.account_id)
    {
      return {
        malformed: true
      }
    }

    if (transactionDefinition.transaction_amount < settings.transactions.minimumAmount ||
      transactionDefinition.transaction_amount > settings.transactions.maximumAmount)
    {
      return {
        declined: true,
        reason: 'LIMIT'
      }
    }

    let account = await PersistService.findOne('accounts', {
      account_id: transactionDefinition.account_id
    })

    if (!account.ok || account.isEmpty) {
      return {
        notfound: true
      }
    }

    let mutatedAccount = await mutateAccount[transactionDefinition.transaction_type](account.object, transactionDefinition.transaction_amount)
    
    if (!mutatedAccount.ok) {
      return {
        declined: true,
        reason: mutateAccount.declineReason
      }
    }

    let fee = transactionDefinition.transaction_type === 'credit' ? settings.transactions.creditFee : settings.transactions.debitFee

    const transactionObject = {
      "transaction_created_at": Date.now(),
      "transaction_id": crypto.randomBytes(settings.resources.idLength).toString('hex'),
      "transaction_type": transactionDefinition.transaction_type,
      "transaction_amount": transactionDefinition.transaction_amount,
      "transaction_fee": fee,
      "transaction_net_amount": transactionDefinition.transaction_amount - fee,
      "transaction_status": 'APPROVED',
      "transaction_description": 'Transaction approved',
      "account_id": transactionDefinition.account_id
    }

    await PersistService.insertOne('transactions', transactionObject)
    await PersistService.updateOne('accounts', mutatedAccount.accountObject._id, mutatedAccount.accountObject)

    let transaction = await PersistService.findOne('transactions', {
      transaction_id: transactionObject.transaction_id
    })

    if(transaction.ok && !transaction.isEmpty) {
      return {
        approved: true,
        found: true,
        object: transaction.object
      }
    }

    return {
      found: false
    }
  },

  async retrieveTransactionsByDateRange(start, end) {
    let transactions = await PersistService.findByRange('transactions', 'transaction_created_at', start, end)
    
    if(transactions.ok && !transactions.isEmpty) {
      return {
        found: true,
        object: transactions.object
      }
    }

    return {
      found: false
    }
  },

  async retrieveAllTransactions() {
    let transactions = await PersistService.findAll('transactions')

    if (transactions.ok && !transactions.isEmpty) {
      return {
        found: true,
        object: transactions.object
      }
    }
    
    return {
      found: false
    }
  }
}
