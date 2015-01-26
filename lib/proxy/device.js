/*
 * proxy/device.js - Local proxy for a remote robot device
 *
 * Copyright (c) 2015 Loren West
 * Licensed under the MIT license.
 */
var Command = require('./command');
var Event = require('./event');
var extend = require('deep-extend');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Device = module.exports = function Device(discoNode, robot, remote) {
  var my = this;
  my.robotName = robot.name;
  var i;
  extend(my, remote);

  // Convert command names to remote proxies
  my.commands = Command.proxyCommands(discoNode, robot.name, my.name, remote.commands)

  // Capture event listeners to set up remote listening and local emitting
  my.on = function(eventName, listener) {
    if (my.listeners(eventName).length === 0) {
      Event.proxyEvent(my, discoNode, my.robotName, my.name, eventName);
    }
    EventEmitter.prototype.on.apply(my, arguments);
  }
  my.removeListener = function(eventName, listener) {
    var my = this;
    EventEmitter.prototype.removeListener.apply(my, arguments);
    if (my.listeners(eventName).length === 0) {
      Event.removeProxiedEvent(my.robotName, my.name, eventName);
    }
  }

};
util.inherits(Device, EventEmitter);
var proto = Device.prototype;

proto.toJSON = function() {
  var my = this;
  var json = {
    name: my.name,
    driver: my.driver,
    connection: my.connection,
    commands: Object.keys(my.commands),
    details: my.details
  }
  return json;
};

