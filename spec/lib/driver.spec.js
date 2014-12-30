'use strict';

var RobotDisco = source("driver");

describe("Cylon.Drivers.RobotDisco", function() {
  var driver = new RobotDisco({
    connection: {}
  });

  it("has no drivers", function(){
    expect(true).to.equal(true);
  });
});
