import crypto from 'crypto'
import bcrypt from 'bcrypt'
import settings from '../config/settings.mjs'
import PeristService from '../services/PersistService.mjs'

const authenticateUser = {
  async kiosk(client, creds) {
    let user = await PeristService.findOne('users', {
      client_id: client.client_id,
      user_id: creds.user_id
    })

    if (!user.isEmpty &&
        await bcrypt.compare(creds.user_pin, user.object.user_pin))
    {
      return {
        authenticated: true,
        name: user.object.user_name
      }
    }

    return {
      authenticated: false
    }
  },

  async redterm(client, creds) {
    return {
      authenticated: true
    }
  },

  async virtual(client, creds) {
    let user = await PeristService.findOne('users', {
      client_id: client.client_id,
      user_email: creds.user_email
    })
    if (!user.isEmpty &&
        await bcrypt.compare(creds.user_password, user.object.user_password))
    {
      return {
        authenticated: true,
        name: user.object.user_name
      }
    }

    return {
      authenticated: false
    }
  },

  async ecommerce(client, creds) {
    return {
      authenticated: true
    }
  }
}

const generateAuthObject = async (client, user) => {
  if (user.authenticated) {
    const tokenObject = {
      session_id: crypto.randomBytes(settings.session.idLength).toString('hex'),
      session_token: crypto.randomBytes(settings.session.tokenLength).toString('hex'),
      session_expires: Date.now() + settings.session.sessionLife
    }

    await PeristService.insertOne('sessions', tokenObject)

    return {
      authenticated: true,
      sessionResources: {
        session: tokenObject,
        client: {
          name: client.client_name
        },
        user: user
      }
    }
  }

  return {
    authenticated: false
  }
}

export default {
  async authenticateSession(context, credentials) {
    if (context?.client_id &&
        context.client_secret &&
        context.type &&
        authenticateUser[context.type] &&
        credentials)
    {
      let client = await PeristService.findOne('clients', {
        client_id: context.client_id,
        client_secret: context.client_secret
      })
      
      
      if (!client.isEmpty) {
        let user = await authenticateUser[context.type](client.object, credentials)
        let authObject = await generateAuthObject(client.object, user)

        if (authObject.authenticated) {
          return authObject
        }
      }
    }

    return {
      authenticated: false
    }
  }
}
