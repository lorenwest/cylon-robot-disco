#!/usr/bin/env node

// Minimum robot - for testing
// usage: testbot {cylon-api-port} [secret]

// Run 2 or 3 of these at the same time - they run on different ports.
// Connect your browser to any one of them and you should see all the
// robots from any robot. You should be able to interact with the local
// robot and any of the remote robots from the same UI.

var apiPort = +process.argv[2] || 3000 + Math.round((Math.random() * 1000));
var secret = process.argv[3] || null;

var Cylon = require('cylon');
Cylon.config({
  logging: {level:'debug'},
})

// The API must be running in order to be discoverable
Cylon.api({
    port:apiPort,
    host:'0.0.0.0',
    ssl: false
});

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
