import PersistService from '../services/PersistService.mjs'
import settings from '../config/settings.mjs'
import crypto from 'crypto'

export default {
  async retrieveCustomer(id) {
    let customer = await PersistService.findOne('customers', {
      customer_id: id
    })

    if (customer.ok && !customer.isEmpty) {
      return {
        found: true,
        object: customer.object
      }
    }
    
    return {
      found: false
    }
  },

  async retrieveAllCustomers() {
    let customers = await PersistService.findAll('customers')

    if (customers.ok && !customers.isEmpty) {
      return {
        found: true,
        object: customers.object
      }
    }

    return {
      found: false
    }
  },

  async createCustomer(customerDefinition) {
    if (!customerDefinition.customer_email ||
        !customerDefinition.account_id)
    {
      return {
          created: false,
          malformed: true
      }
    }

    let existingCustomer = await PersistService.findOne('customers', {
      customer_email: customerDefinition.customer_email
    })

    if (!existingCustomer.isEmpty) {
      return {
        created: false,
        conflict: true
      }
    }

    const customerObject = {
      'customer_created_at': Date.now(),
      'customer_modified_at': Date.now(),
      'customer_id': crypto.randomBytes(settings.resources.idLength).toString('hex'),
      'customer_firstname': customerDefinition.customer_firstname,
      'customer_lastname': customerDefinition.customer_lastname,
      'customer_email': customerDefinition.customer_email,
      'customer_phone': customerDefinition.customer_phone,
      'customer_company': customerDefinition.customer_company,  
      'customer_address': customerDefinition.customer_address,
      'customer_city': customerDefinition.customer_city,
      'customer_state':customerDefinition.customer_state,
      'customer_zip': customerDefinition.customer_zip,
      'customer_country': customerDefinition.customer_country,
      'account_id': customerDefinition.account_id
    }

    let customerCreation = await PersistService.insertOne('customers', customerObject)

    if (customerCreation.ok) {
      return {
        created: true,
        object: customerObject
      }
    }

    return {
      created: false
    }
  },

  async retrieveCustomerBy(query) {
    let customer = await PersistService.findOne('customers', query)

    if (customer.ok && !customer.isEmpty) {
      return {
        found: true,
        object: customer.object
      }
    }
    
    return {
      found: false
    }
  },
  
  async updateCustomer(id, newCustomerData){
    newCustomerData.customer_modified_at = Date.now()

    let oldCustomer = await PersistService.findOne('customers', { customer_id: id })

    let updateResult = await PersistService.updateOne('customers', oldCustomer.object._id.toString(), newCustomerData)
    let updatedCustomer = await PersistService.findOne('customers', oldCustomer.object._id.toString())
    
    if(updateResult.ok && !updatedCustomer.isEmpty) {
      return {
        updated: true,
        object: updatedCustomer.object
      }
    }
  }
}