// Express Setup
const serverAddress = '172.20.10.8'
const serverPort = 3003
const express = require('express')
const app = express()

// MQTT Setup
const brokerAddress = '172.20.10.8'
const brokerPort = 1883
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+brokerAddress)

// Serving folder iiot_nodejs
//app.use(express.static(path.dirname(require.resolve("mosca"))+"/public"))
app.use(express.static('public'))
app.listen(serverPort, function() {
    console.log(`Server listening on ${serverAddress}:${serverPort}!`)
})

// Subscribe if connected to broker
client.on('connect', function() { 
    client.subscribe('topic/sensor1')
    client.subscribe('topic/sensor2')
    client.subscribe('topic/sensor3')
    console.log('Client connected at %s:%s',brokerAddress,brokerPort);
})

// Set variable value on subcribed message
client.on('message', (topic, message) => { 
    console.log('received message on %s: %s', topic, message)
})

// GET request from javascript (script/script.js)
app.get('/messageIn', function(req,res){ 
    console.log('val1: %s | val2: %s | val3: %s',val1,val2,val3); // Display value in console
    res.send({ // Respond with JSON string
        value1: (60+(val1+1)*40).toString(),
        value2: (20+(val2+1)*10).toString(),
        value3: (700+(val3+1)*400).toString()
    })
})
