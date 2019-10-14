// Embedded Mosca initialization
var mosca = require("mosca");
var server = new mosca.Server({
  http: { // Using HTTP protocol
    port: 3000,
    bundle: true,
    static: './public/' // Serving public folder
}
});

// Triggered when server status is ready
server.on('ready', function(){
    console.log('Mosca server is up and running in port 1883!')
    console.log('Using port 3000 for MQTT over Web-Sockets!')
})

// Triggered when a client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id)
})

// Triggered when a message is received
server.on('published', function(packet, client) {
    console.log(packet.payload.toString('utf-8'))
})
