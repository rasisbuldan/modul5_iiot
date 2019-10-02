// Server and broker address
const brokerAddress = '172.20.10.8'
const serverAddress = '172.20.10.8'
const serverPort = 3003

// MQTT Setup
var client = mqtt.connect()

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
    // d = new Date()
    // config.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()) // Current time as chart label
    // config.data.datasets[0].data.push(value).toFixed(2) // 
    // mychart.update();
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
var ctx = document.getElementById('canvas').getContext('2d');
var config = {
    type: 'bar',
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

var mychart = new Chart(ctx, config);