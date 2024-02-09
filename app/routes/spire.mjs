import SpirePollService from '../services/SpirePollService.mjs'
import HttpJsonInterface from '../interfaces/HttpJsonInterface.mjs'

export default {
  registerRoutes(app) {

      app.get('/spire-card-number', async (request , response) =>{
      let fetchCardNumber = await SpirePollService.getCardNumber()
      if (fetchCardNumber) {
        response.status(200).send(HttpJsonInterface.retrieved(
          'RETRIEVED',
          'Customer Card Number was successfully retrieved!',
          fetchCardNumber 
        ))
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })

    app.get('/spire-amount' , async (request, response) => {
      let fetchAmount = await SpirePollService.getAmount()
      let salesPerson = await SpirePollService.getPosNumber()
      
      if (fetchAmount){
        response.status(200).send(HttpJsonInterface.retrieved(
          'RETRIEVED' , 
          'Amount was successfully retrieved!',
          fetchAmount 
        ))
      } else {
        response.status(404).send(HttpJsonInterface.notfound())
      }
    })
  }
}