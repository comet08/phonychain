
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio;
var Relay = new Gpio(18, 'out');
var Relay2 = new Gpio(23, 'out');

Relay.writeSync(1);
Relay2.writeSync(1);

var express = require('express');
var app = express();

app.locals.pretty = true;
app.use(express.static('static'))

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/login', (req, res) => {
  res.render('login.html');
})

app.get('/charge',(req, res)  => {
    var SB = req.query.SB;
    res.render('index.html');
    res.send('SB:${SB}');

});

app.listen(3000, () => console.log('connected, 3000'));

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM1', { baudRate: 9600});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

port.setMaxListeners(100);

port.on('open', function () {

    //var message = '3';
    //port.write(message);
    console.log(' written. Serial Port Opened. Charging Start.');


});

parser.on('data', function (data) {

  console.log('chargedAmount = ' + data + ' mAh');

    if ( data === "o") {
      Relay.writeSync(1);
    }

  });

port.on('error', function (err) {
  console.log('Error: ', err.message)
});

http.listen(8080, function () {
console.log('Now listening to the port 8080..');
});

function handler (req, res) { //create server
fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
  if (err) {
    res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
    return res.end("404 Not Found");
  }
  res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
  res.write(data); //write data from index.html
  return res.end();
});
}

io.sockets.on('connection', function (socket) {// WebSocket Connection

socket.on('autorelay', function(data) {
  Relay.writeSync(data);
});

socket.on('relay', function(data) { //get light switch status from client

    Relay.writeSync(data); //turn LED on or off

});
socket.on('token', function(data) { //get light switch status from client

    port.write(data);

});


});

process.on('SIGINT', function () { //on ctrl+c
Relay.writeSync(0); // Turn LED off
Relay.unexport(); // Unexport LED GPIO to free resources
process.exit(); //exit completely
});
