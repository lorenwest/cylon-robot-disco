/*
 * cylon-robot-disco driver
 * http://cylonjs.com
 *
 * Copyright (c) 2015 Loren West
 * Licensed under the MIT license.
*/

"use strict";

var Cylon = require('cylon');

var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  // Include a list of commands that will be made available to the API.
  this.commands = {
    // This is how you register a command function for the API;
    // the command should be added to the prototype, see below.
    hello: this.hello
  };
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

Driver.prototype.start = function(callback) {
  callback();
};

Driver.prototype.halt = function(callback) {
  callback();
};

Driver.prototype.hello = function() {
  Cylon.Logger.info('Hello World!');
}
