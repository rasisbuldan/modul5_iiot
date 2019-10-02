// Mosca broker setup
const brokerAddress = '172.20.10.8'
const brokerPort = 1883
const mosca = require('mosca')
const server = new mosca.Server({
    port: brokerPort
})
app.listen(serverPort, function(){
    console.log(`Server listening on ${serverAddress}:${serverPort}!`)
});

server.on('ready', function() {
    console.log('Mosca server running on %s:%s',brokerAddress,brokerPort);
});

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});