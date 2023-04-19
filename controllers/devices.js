const devicesRouter = require('express').Router()
const Device = require('../models/device')
const { sendMQTTMessage, subscribeMqttTopic } = require('../utils/mqtt')

devicesRouter.get('/', (request, response) => {
  Device.find({}).then(devices => {
    response.json(devices)
  })
})

devicesRouter.get('/:id', (request, response, next) => {
  Device.findById(request.params.id)
    .then(device => {
      if (device) {
        response.json(device)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

devicesRouter.post('/:id/relay', async (request, response, next) => {
  const device = await Device.findById(request.params.id)
  const body = request.body
  if(device){
    sendMQTTMessage(device.name, body.relay)
    device.relay = body.relay
    await device.save()

    response.send('Device status updated')
  }
  else{
    response.send('cannot find device with id'+ request.params.id)
  }
  

})

//post request for adding device
devicesRouter.post('/', async (request, response, next) => {
    const body = request.body
    const device = await Device.findOne( {name: body.name})
    if (device){
        response.send('device already exist')
    }
    else {
        const newDevice = new Device({
            name: body.name,
            temp: null,
            relay: false,
        })

        await newDevice.save()

        subscribeMqttTopic(newDevice.name)

        response.status(201).json(newDevice.toJSON)
    }
})


module.exports = devicesRouter