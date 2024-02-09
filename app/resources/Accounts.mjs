import crypto from 'crypto'
import settings from '../config/settings.mjs'
import PersistService from '../services/PersistService.mjs'

export default {
  async createAccount(accountDefinition) {
    if (!accountDefinition.account_card || !accountDefinition.account_currency) {
      return {
          created: false,
          malformed: true
      }
    }

    let existingCard = await PersistService.findOne('accounts', {
      account_card: accountDefinition.account_card
    })

    if (!existingCard.isEmpty) {
      return {
        created: false,
        conflict: true,
        existingAccountObject: existingCard
      }
    }

    const accountObject = {
      'account_created_at': Date.now(),
      'account_modified_at': Date.now(),
      'account_id': crypto.randomBytes(settings.resources.idLength).toString('hex'),
      'account_card': accountDefinition.account_card,
      'account_status': 'active',
      'account_balance': 0,
      'account_currency': accountDefinition.account_currency,
      'account_registered': false,
      'account_tos': accountDefinition.account_tos,
      'account_notes': [],
      'account_points': 0
    }

    let accountCreation = await PersistService.insertOne('accounts', accountObject)

    if (accountCreation.ok) {
      return {
        created: true,
        object: accountObject
      }
    }

    return {
      created: false
    }
  },

  async retrieveAllAccounts() {
    let account = await PersistService.findAll('accounts')
    if (account.ok && !account.isEmpty) {
      return {
        found: true,
        object: account.object
      }
    }

    return {
      found: false
    }
  },
  
  async retrieveAccountByCardNumber(query) {
    let account = await PersistService.findOne('accounts', {
      account_card: query
    })

    if(account.ok && !account.isEmpty) {
      return {
        found: true,
        object: account.object
      }
    }

    return {
      found: false
    }
  },

  async retrieveAccount(id) {
    let account = await PersistService.findOne('accounts', {
      account_id: id
    })

    if (account.ok && !account.isEmpty) {
      return {
        found: true,
        object: account.object
      }
    }

    return {
      found: false
    }
  },

  async retrieveAccountsJoinedWithCustomers() {
    let accounts = await PersistService.join(
      'accounts', {}, 'customers', 'account_id', 'account_id', 'customerInfo'
    )
    if (accounts?.ok && !accounts?.isEmpty) {
      return {
        found: true,
        object: accounts?.object
      }
    }
    return {
      found: false
    }
  },

  async updateAccount(id, newAccountData) {
    const accountObjectId = (await this.retrieveAccount(id)).object._id
    const cases = ['account_status', 'account_tos', 'account_card']

    for(let key of Object.keys(newAccountData)){
      if(!cases.includes(key)) {
        return {
          updated: false,
          malformed: true
        }
      }
    }

    newAccountData.account_modified_at = Date.now()
    let updateResult = await PersistService.updateOne('accounts', accountObjectId, newAccountData)
    let updatedAccount = await PersistService.findOne('accounts', {
      account_id: id
    })

    if(updateResult.ok && !updatedAccount.isEmpty) {
      return {
        updated: true,
        object: updatedAccount.object
      }
    }
  },

  async addLoyaltyPoints(id, amount) {
    let account = await PersistService.findOne('accounts', {
      account_id: id
    })

    if (account.ok && !account.isEmpty) {
      const points = amount * settings.loyalty.pointMultiple
      account.object.account_points += points
      account.object.account_modified_at = Date.now()

      await PersistService.updateOne('accounts', account.object._id.toString(), account.object)
      
      return {
        updated: true,
        object: account.object
      }
    }
    
    return {
      updated: false,
      notfound: true
    }
  }
}
