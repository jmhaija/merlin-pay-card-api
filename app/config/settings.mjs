export default {
  "server" : {
    "name": "RCC API",
    "port": 8001
  },
  "session": {
    "idLength": 16,
    "tokenLength": 128,
    "sessionLife": 3600000
  },
  "resources": {
    "idLength": 16
  },
  "transactions": {
    "minimumAmount": 20,
    "maximumAmount": 5000,
    "creditFee": 3.5,
    "debitFee": 0
  },
  "loyalty": {
    "pointMultiple": 100
  }
}
