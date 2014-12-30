'use strict';

var Cylon = require('cylon');
var RobotDisco = source("adaptor");
Cylon.config({
  logging: {level: 'warn'},
  api: {port:3000, ssl: false}
})

// The API must be running in order to be discoverable
Cylon.api();

// Define a robot with this adaptor
var robot = Cylon.robot({
  name: 'cylon-disco-testbot',
  connections: {
    disco: {adaptor: 'robot-disco', port: 12345, secret:'hand-shake'}
  }
});
var adaptor = robot.connections.disco;

describe("Cylon.Adaptors.RobotDisco", function() {

  it("has an adaptor", function() {
    expect(adaptor).to.be.instanceOf(Cylon.Adaptor);
  });

  it('starts up nicely', function(done) {
    robot.start(done);
  })


});
