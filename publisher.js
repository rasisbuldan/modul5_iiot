var t = 0
var u = 0
var n = 0;
const brokerAddress = '192.168.0.103'
//var host = 'mqtt://192.168.43.106'
//var options = {retain: true}

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://'+brokerAddress)

client.on('connect', function () {
    console.log("publishing to %s", brokerAddress);
    setInterval(function(){
        t++;
        u = Math.sin(0.1*t)
        n1 = ((u+1)*50).toFixed(2);
        n2 = (((u+1)*20)+10).toFixed(2);
        n3 = (((u+1)*600)+300).toFixed(2);
        client.publish('topic/sensor1',n1.toString(),{retain: true});
        client.publish('topic/sensor2',n2.toString(),{retain: true});
        client.publish('topic/sensor3',n3.toString(),{retain: true});
        console.log("published message");
    },1000)
})
