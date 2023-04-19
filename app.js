const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const devicesRouter = require('./controllers/devices')
const pricesRouter = require('./controllers/prices')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const scheduledFunctions = require('./utils/cron_jobs')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use('/api/devices', devicesRouter)
app.use('/api/prices', pricesRouter)

scheduledFunctions.initScheduledJobs;


module.exports = app