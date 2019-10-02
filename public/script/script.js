var s1 = 0
var s2 = 0
var s3 = 0
var s4 = 0

const host = 'http://172.20.10.8:3003'

async function changeValue(){
    var response = await fetch(host+'/messageIn')
    var data = await response.json()

    // Update HTML content
    console.log('received data: %s',data.value1);
    document.getElementById("humidity_value").innerHTML = data.value1
    document.getElementById("temperature_value").innerHTML = data.value2
    document.getElementById("brightness_value").innerHTML = data.value3

    // Update chart
    d = new Date()
    config.data.labels.push(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds());
    config.data.datasets[0].data.push((60+(data.value1+1)*40).toFixed(2));
    mychart.update();
}

setInterval(function(){changeValue();},200)

var x1 = false;
var x2 = false;
var x3 = false;
var x4 = false;

function changeStatus1(){
    x1 = !x1;
    switch (x1) {
        case false: // LED mati
        document.getElementById("ledstatus1").style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED nyala
        document.getElementById("ledstatus1").style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Tidak ada data
        document.getElementById("ledstatus1").style.backgroundColor = "white";
    }
}

function changeStatus2(){
    x2 = !x2;
    switch (x2) {
        case false: // LED mati
        document.getElementById("ledstatus2").style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED nyala
        document.getElementById("ledstatus2").style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Tidak ada data
        document.getElementById("ledstatus2").style.backgroundColor = "white";
    }
}

function changeStatus3(){
    x3 = !x3;
    switch (x3) {
        case false: // LED mati
        document.getElementById("ledstatus3").style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED nyala
        document.getElementById("ledstatus3").style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Tidak ada data
        document.getElementById("ledstatus3").style.backgroundColor = "white";
    }
}

function changeStatus4(){
    x4 = !x4;
    switch (x4) {
        case false: // LED mati
        document.getElementById("ledstatus4").style.backgroundColor = "rgb(231, 76, 60)";
        break;
        case true: // LED nyala
        document.getElementById("ledstatus4").style.backgroundColor = "rgb(46, 204, 113)";
        break;
        default: // Tidak ada data
        document.getElementById("ledstatus4").style.backgroundColor = "white";
    }
}

// Get Time
var d = new Date()
var h = d.getHours()
var m = d.getMinutes()
var s = (d.getMilliseconds())/1000
var now = h+':'+m+':'+s

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
