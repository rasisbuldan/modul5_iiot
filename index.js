// Global Variable
var brokerAddress = '172.20.10.8'
var val1 = 0
var val2 = 0
var val3 = 0

// Express Setup
const express = require('express')
const app = express()
const port = 3003

// MQTT Setup
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+brokerAddress)

// Body Parser
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Serving folder iiot_nodejs
app.use(express.static('public'))

app.listen(port, () => console.log(`listening on port ${port}!`))

client.on('connect', function() {
    client.subscribe('topic/sensor1')
    client.subscribe('topic/sensor2')
    client.subscribe('topic/sensor3')
    displayConnectedMessage()
})

client.on('message', (topic, message) => {
    console.log('received message on %s: %s', topic, message)
    switch (topic) {
        case 'topic/sensor1': val1 = message; break;
        case 'topic/sensor2': val2 = message; break;
        case 'topic/sensor3': val3 = message; break;
    }
})

function displayConnectedMessage(){
    console.log('client connected at %s:%s',brokerAddress,port);
}

// Express Event Handling
app.get('/messageIn', function(req,res){
    console.log('val1: %s | val2: %s | val3: %s',val1,val2,val3);
    res.send({
        value1: (60+(val1+1)*40).toString(),
        value2: (20+(val2+1)*10).toString(),
        value3: (700+(val3+1)*400).toString()
    })
})

app.post('/messageOut', function(req, res) {
    var ledVal1 = req.body.val1;
    console.log("MESSAGE SENT: %s",ledVal1);
    client.subscribe('topic/led1',ledVal1)
});
