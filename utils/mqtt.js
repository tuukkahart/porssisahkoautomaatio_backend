//skannaa verkkoa
//lisää uuden laitteen tietokantaan kun sellainen havaitaan 
//tallentaa tietokantaan lämpötiladataa puolen tunnin välein
//tallentaa laitteen releen tilan kantaan
//sisältää funktion jota kutsumalla voidaan lähettää käskyjä releelle.
const Device = require('../models/device')
const mqtt = require('mqtt');
// Määritetään MQTT-client
const mqttClient = mqtt.connect('mqtt://192.168.0.107');

mqttClient.on('connect', async () => {
    console.log('Connected to MQTT broker');
    const devices = await Device.find()
    console.log(devices)

    devices.forEach( device => {
        const topic = `${device.name}/temp`
        mqttClient.subscribe(topic)
    })

    
});

mqttClient.on('error', (error) => {
    console.error('MQTT error:', error);
});

//mqttClient.subscribe("Device1/temp")

mqttClient.on('message', (topic, message) => {
    const topicParts = topic.split('/');
    console.log(topicParts)
    const deviceId = topicParts[0];
    console.log(deviceId)


    if (topicParts[1] === 'temp') {
        const mqttMessage = message.toString()
        const temperature = parseFloat(mqttMessage.slice(-2));
        console.log(temperature)
        updateTemperature(deviceId, temperature);
    }
});




// Lähetetään MQTT-viesti
function sendMQTTMessage(deviceName, relay) {
    if (mqttClient.connected){
        const message = relay ? '1' : '0'
        const topic = `${deviceName}/led`
        mqttClient.publish(topic, message);
        console.log('Mqtt '+ message +' sent to topic '+ topic)
    }
    
}

function subscribeMqttTopic(deviceName) {
    
    mqttClient.subscribe(`${deviceName}/temp`)
}

const updateTemperature = async (deviceId, temperature) => {
    const device = await Device.findOne( {name: deviceId})
      if(device && device.temperature !== temperature){
        device.temp = temperature;
        device.save();
      }
      else{
        console.log("lämpötila on sama, ei päivitetä tietokantaa..")
      }
      
}

module.exports = { sendMQTTMessage, subscribeMqttTopic };