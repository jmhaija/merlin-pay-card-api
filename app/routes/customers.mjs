import Customers from '../resources/Customers.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {
    app.get('/customers', async (request, response) => {
      if(Object.keys(request.query).length > 0) {
        let fetchedCustomer = await Customers.retrieveCustomerBy(request.query)

        if (fetchedCustomer.found) {
          response.status(200).send(HttpJsonInterface.retrieved(
            'RETRIEVED',
            'Customer was successfully retrieved',
            fetchedCustomer.object
          ))
        } else {
          response.status(404).send(HttpJsonInterface.notfound())
        }
      } else {
        let customer = await Customers.retrieveAllCustomers()   
        if (customer.found) {
          response.status(200).send(HttpJsonInterface.retrieved(
            'RETRIEVED',
            'Customers was successfully retrieved',
            customer.object
          ))
        } else {
          response.status(404).send(HttpJsonInterface.notfound())
        }
      }
    })

    app.post('/customers', async (request, response) => {
      let newCustomer = await Customers.createCustomer(request.body.customer)
      if (newCustomer.created) {
        response.status(201).send(HttpJsonInterface.created(
          'CREATED',
          'Customer was successfully created',
          newCustomer.object
        ))
      } else if (newCustomer.malformed) {
        response.status(400).send(HttpJsonInterface.malformed())
      } else if (newCustomer.conflict) {
        response.status(409).send(HttpJsonInterface.conflict(
          'CUSTOMER_EXISTS',
          'The email you tried to register already exists'
        ))
      } else {
        response.status(500).send()
      }
    })

    app.get('/customers/:id', async (request, response) => {
      let fetchedCustomer = await Customers.retrieveCustomer(request.params.id)

      if (fetchedCustomer.found) {
        response.status(200).send(HttpJsonInterface.retrieved(
          'RETRIEVED',
          'Customer was successfully retrieved',
          fetchedCustomer.object
        ))
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })
    
    app.patch('/customers/:id', async (request, response) => {
      const updateBody = request.body
      let updatedCustomer = await Customers.updateCustomer(request.params.id, updateBody)

      if(updatedCustomer.updated) {
        response.status(200).send(HttpJsonInterface.updated(
          'UPDATED',
          'Customer was successfully updated',
          updatedCustomer.object
        ))
      } else if (updatedCustomer.malformed) {
        response.status(400).send(HttpJsonInterface.malformed()) 
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })
  }
}
