var t = 0
var u = 0
var n = 0;
const brokerAddress = 'mqtt://172.20.10.8'
//var host = 'mqtt://192.168.43.106'
//var options = {retain: true}

var mqtt = require('mqtt')
var client = mqtt.connect(brokerAddress)

client.on('connect', function () {
    console.log("publishing to %s", brokerAddress);
    setInterval(function(){
        t++;
        u = Math.sin(0.1*t)
        n = u.toFixed(4)
        client.publish('topic/sensor1',n.toString(),{retain: true});
        client.publish('topic/sensor2',n.toString(),{retain: true});
        client.publish('topic/sensor3',n.toString(),{retain: true});
        console.log("published message");
    },200)
})
