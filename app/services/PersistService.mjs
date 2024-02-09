import dotenv from 'dotenv'
dotenv.config()
import { MongoClient, ObjectId } from 'mongodb'
import StandardInterface from '../interfaces/StandardInterface.mjs'

let dbInstance = null

export default {
  async start() {
    const mongoDBURL = process.env.MONGODB_CONNECTION_STRING
    const connection = await MongoClient.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    dbInstance = connection.db()
  },

  async findAll(collection) {
    try {
      let object = await dbInstance.collection(collection).find({}).toArray()
      return StandardInterface.success(object)
    } catch (error) {
      return StandardInterface.error(error)
    }
  },

  async findByRange(collection, attribute, floor, ceiling) {
    
    try {
      let object = await dbInstance.collection(collection).find({ [attribute]: { $gte: Number(floor), $lte: Number(ceiling)}}).toArray()
      return StandardInterface.success(object)
    } catch (error) {
      return StandardInterface.error(error)
    }
  },

  async findOne(collection, queryObject) {
    try {
      let object = await dbInstance.collection(collection).findOne(queryObject)
      return StandardInterface.success(object)
    } catch (error) {
      return StandardInterface.error(error)
    }
  },

  async insertOne(collection, newObject) {
    try {
      let object = await dbInstance.collection(collection).insertOne(newObject)
      return StandardInterface.success(object)
    } catch (error) {
      return StandardInterface.error(error)
    }
  },

  async updateOne(collection, id, setObject) {
    try {
      let object = await dbInstance.collection(collection).updateOne(
        { _id: new ObjectId(id) },
        {
          $set: setObject
        }
      )
      return StandardInterface.success(object)
    } catch(error) {
      return StandardInterface.error(error)
    }
  },

  async deleteOne(collection, queryObject) {
    try {
      let object = await dbInstance.collection(collection).deleteOne(queryObject)
      return StandardInterface.success(object)
    } catch (error) {
      return StandardInterface.error(error)
    }
  },

  async join(collection, match, joinCollection, localField, foreignField, as) {
    try {
      let object = await dbInstance.collection(collection).aggregate([
        { $match: match },
        {
          $lookup: {
            from: joinCollection,
            localField: localField, 
            foreignField: foreignField, 
            as: as 
          }
        }
      ]).toArray()
      return StandardInterface.success(object)
    } catch(error) {
      return StandardInterface.error(error)
    }
  }
}
