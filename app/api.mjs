import PersistService from './services/PersistService.mjs'
import RequestRoutingService from './services/RequestRoutingService.mjs'

(async () => {
  await PersistService.start()
  await RequestRoutingService.start()
})()
