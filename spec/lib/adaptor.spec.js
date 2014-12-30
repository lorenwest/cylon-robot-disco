'use strict';

var Cylon = require('cylon');
var StubAdaptor = source("adaptor");

describe("Cylon.Adaptors.RobotDisco", function() {
  var adaptor = new StubAdaptor();

  it("has an adaptor", function() {
    expect(adaptor).to.be.instanceOf(Cylon.Adaptor);
  });

  it("Calls the connect callback", function(done) {
    adaptor.connect(done);
  });

  it("Calls the disconnect callback", function(done) {
    adaptor.disconnect(done);
  });

});
