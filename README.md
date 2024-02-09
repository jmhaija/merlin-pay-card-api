# RCC API

## Configuration

In the `.env` file, the following configuration parameters need to be set:

| Parameter | Description |
| --------- | ----------- |
| MONGODB_CONNECTION_STRING | The connection string used to connect to MongoDB |
| USER_NAME | Spire credentials |
| PASSWORD | Spire ceredentials |
## Installation

```
npm install
```

## Run for Development

This will start the application with `nodemon`.

```
npm run dev
```

## Run for Production

This will start the application in the background with `pm2`.

`pm2` needs to be installed as a global command.

Applications running with `pm2` need to be stopped or restarted before running again.


```
npm run prod
```

## Stop Production Application

This will take the production API offline.

```
npm run kill
```
