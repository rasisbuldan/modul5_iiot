var mosca = require("mosca");  //inisialisasi mosca mqtt broker
var server = new mosca.Server({
  http: {
    port: 3000,
    bundle: true,
    static: './public/'
  }
});  // inisialisasi mqtt broker with httpserver and mqtt over websocket for client

server.on('ready', function(){
    console.log('Mosca server is up and running in port 1883!')
    console.log('Using port 3000 for MQTT over Web-Sockets!')
})

// fired when a client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id)
})

// fired when a message is received
server.on('published', function(packet, client) {
    //if (packet.topic == '/example') {
      console.log(packet.payload.toString('utf-8'))
    //}
})