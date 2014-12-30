#!/usr/bin/env node

// Minimum robot - for testing
// usage: testbot {cylon-api-port} [secret]
var apiPort = +process.argv[2] || 3000 + Math.round((Math.random() * 1000));
var secret = process.argv[3] || null;

var Cylon = require('cylon');
Cylon.config({
  logging: {level:'debug'},
  api: {port:apiPort, host:'0.0.0.0', ssl: false}
})

// The API must be running in order to be discoverable
Cylon.api();

// Define a robot with this adaptor
var robot = Cylon.robot({
  name: 'testbot-' + apiPort,
  connections: {
    disco: {adaptor: 'robot-disco', secret:secret}
  },
  devices: {
    pingback: {driver: 'ping'}
  }
}).start();
