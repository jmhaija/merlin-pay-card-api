import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export default {

    async getCardNumber() {
      return await axios.get(process.env.URL_LINK,{auth: {
        username: process.env.USER_NAME , 
        password: process.env.PASSWORD
    }}).then((resp)=>{
       return resp.data.records[0].referenceNo
      }).catch((err) => {
        console.log(err);
      })
    },
    
    async getAmount(){
      return await axios.get(process.env.URL_LINK,{auth: {
        username: process.env.USER_NAME , 
        password: process.env.PASSWORD
      }}).then((resp)=>{
       return resp.data.records[0].total
      }).catch((err) => {
        console.log(err);
      })
  },
  
  async getPosNumber() {
    return await axios.get(process.env.URL_LINK,{auth: {
      username: process.env.USER_NAME , 
      password: process.env.PASSWORD
    }}).then((resp)=>{
      posNumber = resp.data.records[0].salespersonNo
      return posNumber
    }).catch((err) => {
      console.log(err);
    })
  }
}
