// Server and broker address
const brokerAddress = 'broker_ip_address'
const serverAddress = 'broker_ip_address'
const serverPort = 'broker_port'

// MQTT Setup
var client = mqtt.connect('ws:'+brokerAddress+':'+serverPort);

// Initialization before data received from broker
var ledstate = [,false, false, false, false] // index 1-4 for ease of use

// Run when connected (continuous)
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

// Run when message received
client.on('message', function(topic, message) { 
    // console.log('received message on %s: %s', topic, message)
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

// Update HTML when message received
function changeValue(value,value_id) {
    // Update HTML content
    // console.log('Received data VALUE for id %s : %s',value_id,value);
    document.getElementById(value_id).innerHTML = value

    // Update chart
    d = new Date()
    var timeNow = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds(); // Get current time
    switch (value_id) {
        case 'humidity_value':
            if (config[0].data.datasets[0].data.length > 10) {
                config[0].data.datasets[0].data.shift()
                config[0].data.labels.shift()
            }
            config[0].data.labels.push(timeNow) // Current time as chart label
            config[0].data.datasets[0].data.push(value).toFixed(2)
            mychart1.update();
            break;
        case 'temperature_value':
            if (config[1].data.datasets[0].data.length > 10) {
                config[1].data.datasets[0].data.shift()
                config[1].data.labels.shift()
            }
            config[1].data.labels.push(timeNow) // Current time as chart label
            config[1].data.datasets[0].data.push(value).toFixed(2)
            mychart2.update();
            break;
        case 'brightness_value':
            if (config[2].data.datasets[0].data.length > 10) {
                config[2].data.datasets[0].data.shift()
                config[2].data.labels.shift()
            }				
            config[2].data.labels.push(timeNow) // Current time as chart label
            config[2].data.datasets[0].data.push(value).toFixed(2)
            mychart3.update();
            break;
    }
}

// Update LED value with received state
function changeLED(state,led_id){ // Change LED on message received
    console.log('Received data LED for id %s : %s',led_id,state.toString('utf-8'));

    // LED id switch to determine which led state to be update 
    switch (led_id) {
        case 'ledstatus1': ledstate[1] = state.toString('utf-8'); break;
        case 'ledstatus2': ledstate[2] = state.toString('utf-8'); break;
        case 'ledstatus3': ledstate[3] = state.toString('utf-8'); break;
        case 'ledstatus4': ledstate[4] = state.toString('utf-8'); break;
        default: break;
    }

    // Change color on state change
    switch (state.toString('utf-8')) {
        case 'false': // LED Mati (Merah)
            document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case 'true': // LED Nyala (Hijau)
            document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Data Invalid
            document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "white";
        break;
    }
}

// Publish LED state when button pressed (toggle)
function changeLEDButton() {
    console.log("Button clicked with id: %s",event.srcElement.id)
    var LEDid = event.srcElement.id.toString('utf-8')
    console.log("ledid: ", LEDid);
    
    switch (event.srcElement.id) { // Select LED state array to update
        case 'ledstatus1': led = ledstate[1]; break;
        case 'ledstatus2': led = ledstate[2]; break;
        case 'ledstatus3': led = ledstate[3]; break;
        case 'ledstatus4': led = ledstate[4]; break;
        default: break;
    }

    // Toggle LED state and publish
    if(led.toString('utf-8') == 'false'){
        client.publish("topic/"+event.srcElement.id,'true')
    }
    else{
        client.publish("topic/"+event.srcElement.id,'false')
    }
}

// chart.js
var ctx1 = document.getElementById('canvas1').getContext('2d');
var ctx2 = document.getElementById('canvas2').getContext('2d');
var ctx3 = document.getElementById('canvas3').getContext('2d');
var config = [
    {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [],
            fill: false,
        }]
    }
},
{
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [],
            fill: false,
        }]
    }
},
{
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [],
            fill: false,
        }]
    }
}];

var mychart1 = new Chart(ctx1, config[0]);
var mychart2 = new Chart(ctx2, config[1]);
var mychart3 = new Chart(ctx3, config[2]);