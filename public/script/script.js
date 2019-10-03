// Server and broker address
const brokerAddress = '172.20.10.8'
const serverAddress = '172.20.10.8'
const serverPort = 3000

// MQTT Setup
var client = mqtt.connect('ws:localhost:3000');

// Global Variable (LED)
var x1 = false;
var x2 = false;
var x3 = false;
var x4 = false;

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
    //console.log('received message on %s: %s', topic, message)
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
    //console.log('Received data VALUE for id %s : %s',value_id,value);
    document.getElementById(value_id).innerHTML = value

    // Update chart
    d = new Date()
    switch (value_id) {
        case 'humidity_value':
            config1.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config1.data.datasets[0].data.push(value).toFixed(2)
            mychart1.update();
            break;
        case 'temperature_value':				
            config2.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config2.data.datasets[0].data.push(value).toFixed(2)
            mychart2.update();
            break;
        case 'brightness_value':				
            config3.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
            config3.data.datasets[0].data.push(value).toFixed(2)
            mychart3.update();
            break;
    }
}

// Update LED value with received state
function changeLED(state,led_id){ // Change LED on message received
    console.log('Received data LED for id %s : %s',led_id,state.toString('utf-8'));
    switch (led_id) {
        case 'ledstatus1':
            x1 = state.toString('utf-8');
            break;
        case 'ledstatus2':
            x2 = state.toString('utf-8');
            break;
        case 'ledstatus3':
            x3 = state.toString('utf-8');
            break;
        case 'ledstatus4':
            x4 = state.toString('utf-8');
            break;
        default:
            break;
    }
    switch (state.toString('utf-8')) {
        case 'false': // LED Mati
        document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case 'true': // LED Nyala
        document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Data Invalid
        document.getElementById(led_id.toString('utf-8')).style.backgroundColor = "white";
    }
}

// Publish LED state when button pressed (toggle)
function changeLEDButton() {
    console.log("Button clicked with id: %s",event.srcElement.id)
    var LEDid = event.srcElement.id.toString('utf-8')
    console.log("ledid: ", LEDid);
    
    switch (event.srcElement.id) {
        case 'ledstatus1':
            if(x1.toString('utf-8') == 'false'){
                client.publish("topic/"+event.srcElement.id,'true')
            }
            else{
                client.publish("topic/"+event.srcElement.id,'false')
            }
            break;  
        case 'ledstatus2':
            if(x2.toString('utf-8') == 'false'){
                client.publish("topic/"+event.srcElement.id,'true')
            }
            else{
                client.publish("topic/"+event.srcElement.id,'false')
            }
            break;
        case 'ledstatus3':
            if(x3.toString('utf-8') == 'false'){
                client.publish("topic/"+event.srcElement.id,'true')    
            }
            else{
                client.publish("topic/"+event.srcElement.id,'false')
            }
            break;
        case 'ledstatus4':
            if(x4.toString('utf-8') == 'false'){
                client.publish("topic/"+event.srcElement.id,'true')    
            }
            else{
                client.publish("topic/"+event.srcElement.id,'false')
            }
        default:
            break;
    }
}

// chart.js
var ctx1 = document.getElementById('canvas1').getContext('2d');
var config1 = {
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
};
var ctx2 = document.getElementById('canvas2').getContext('2d');
var config2 = {
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
};
var ctx3 = document.getElementById('canvas3').getContext('2d');
var config3 = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Brightness',
            backgroundColor: 'rgb(46, 204, 113)',
            borderColor: 'rgb(46, 204, 113)',
            data: [],
            fill: false,
        }]
    }
};

var mychart1 = new Chart(ctx1, config1);
var mychart2 = new Chart(ctx2, config2);
var mychart3 = new Chart(ctx3, config3);