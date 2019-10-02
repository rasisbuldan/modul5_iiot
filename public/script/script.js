// Server and broker address
const brokerAddress = '172.20.10.8'
const serverAddress = '172.20.10.8'
const serverPort = 3000

// MQTT Setup
var client = mqtt.connect('ws:172.20.10.8:3000');

client.on('connect', function() {
    console.log('client connected at %s:%s',brokerAddress);
    client.subscribe('topic/sensor1')
    client.subscribe('topic/sensor2')
    client.subscribe('topic/sensor3')
    client.subscribe('topic/ledstatus1')
    client.subscribe('topic/ledstatus2')
    client.subscribe('topic/ledstatus3')
    client.subscribe('topic/ledstatus4')
})

client.on('message', function(topic, message) { 
    console.log('received message on %s: %s', topic, message)
    switch (topic) {
        case 'topic/sensor1': changeValue(message,"humidity_value"); break;
        case 'topic/sensor2': changeValue(message,"temperature_value"); break;
        case 'topic/sensor3': changeValue(message,"brightness_value"); break;
        case 'topic/ledstatus1' : changeLED(message,"ledstatus1"); break;
        case 'topic/ledstatus2' : changeLED(message,"ledstatus2"); break;
        case 'topic/ledstatus3' : changeLED(message,"ledstatus3"); break;
        case 'topic/ledstatus4' : changeLED(message,"ledstatus4"); break;
    }
})

function changeValue(value,value_id) {
    // Update HTML content
    console.log('Received data VALUE for id %s : %s',value_id,value);
    document.getElementById(value_id).innerHTML = value

    // Update chart
    d = new Date()
    switch (value_id) {
        case 'humidity_value':
                if (config1.data.datasets[0].length > 5) {				
                    config1.data.datasets[0].data.shift();
                }
                config2.data.labels.shift();
            config1.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config1.data.datasets[0].data.push(value).toFixed(2)

            mychart1.update();
            break;
        case 'temperature_value':				
        if (config2.data.datasets[0].length > 5) {				
            config2.data.datasets[0].data.shift();
        }
        config2.data.labels.shift();
            config2.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config2.data.datasets[0].data.push(value).toFixed(2)

            mychart2.update();
            break;
        case 'brightness_value':
            if (config3.data.datasets[0].length > 5) {				
                config3.data.datasets[0].data.shift();
            }
            config2.data.labels.shift();
            config3.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config3.data.datasets[0].data.push(value).toFixed(2)

            mychart3.update();
            break;
    }
}

function changeLED(state,led_id){
    console.log('Received data LED for id %s : %s',led_id,state);
    switch (state) {
        case false: // LED Mati
        document.getElementById(led_id).style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED Nyala
        document.getElementById(led_id).style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Data Invalid
        document.getElementById(led_id).style.backgroundColor = "white";
    }
}

function changeLEDButton() {
    console.log("Button clicked with id: %s",event.srcElement.id)
    console.log("Prev state: %s",event.srcElement.backgroundColor == "rgb(46, 204, 113)")
    state = !(event.srcElement.backgroundColor == "rgb(46, 204, 113)") // State sebelumnya = true
    console.log("Next state: %s", state)
    switch (state) {
        case false: // LED Mati
        document.getElementById(event.srcElement.id).style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED Nyala
        document.getElementById(event.srcElement.id).style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Data Invalid
        document.getElementById(event.srcElement.id).style.backgroundColor = "white";
    }
    client.publish("topic/"+event.srcElement.id,state)
}

// chart.js
var ctx1 = document.getElementById('canvas1').getContext('2d');
var config1 = {
    type: 'line',
    data: {
        labels: [0,0,0,0,0,0,0,0,0,0],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [0,0,0,0,0,0,0,0,0,0],
            fill: false,
        }]
    }
};
var ctx2 = document.getElementById('canvas2').getContext('2d');
var config2 = {
    type: 'line',
    data: {
        labels: [0,0,0,0,0,0,0,0,0,0],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [0,0,0,0,0,0,0,0,0,0],
            fill: false,
        }]
    }
};
var ctx3 = document.getElementById('canvas3').getContext('2d');
var config3 = {
    type: 'line',
    data: {
        labels: [0,0,0,0,0,0,0,0,0,0],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [0,0,0,0,0,0,0,0,0,0],
            fill: false,
        }]
    }
};

var mychart1 = new Chart(ctx1, config1);
var mychart2 = new Chart(ctx2, config2);
var mychart3 = new Chart(ctx3, config3);