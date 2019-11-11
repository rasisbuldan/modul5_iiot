// Embedded Mosca initialization
var mosca = require("mosca");
var broker = new mosca.Server({
    bundle: true,
    port: 1883
});

// HTTP Serve initialization
var express = require("express");
var http = require("http");
var app = express();
var srv = http.createServer(app);
var path = require("path");

app.use(express.static(path.dirname(require.resolve("mosca"))+"public/"));
app.listen(3000, function(){
    console.log(path.dirname(require.resolve("mosca")))
    console.log("Express server listening on port 3000!")
})

// Triggered when server status is ready
broker.on('ready', function(){
    console.log('Mosca server is up and running in port 1883!')
})