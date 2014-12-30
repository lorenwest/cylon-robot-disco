/**
 * proxy/robot.js - Local proxy for a remote robot
 *
 * Copyright (c) 2014-2015 Loren West
 * Licensed under the MIT license.
 */
var Cylon = require('cylon');
var DeviceProxy = require('./device');
var Command = require('./command');
var extend = require('deep-extend');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var NOP = function(){};

var Robot = module.exports = function Robot(discoNode, remote) {
  var my = this;
  var i;
  extend(my, remote);
  my.isRemote = true;

  // Build local command proxies to remote calls
  my.commands = Command.proxyCommands(discoNode, my.name, null, remote.commands)
  my.connections = {};
  remote.connections.forEach(function(connection) {
    my.connections[connection.name] = connection;
  });
  my.devices = {};
  remote.devices.forEach(function(device) {
    my.devices[device.name] = new DeviceProxy(discoNode, my, device);
  });

  // Capture event listeners to set up remote listening and local emitting
  my.on = function(eventName, listener) {
    if (my.listeners(eventName).length === 0) {
      Event.proxyEvent(my, discoNode, my.name, '', eventName);
    }
    EventEmitter.prototype.on.apply(my, arguments);
  }
  my.removeListener = function(eventName, listener) {
    var my = this;
    EventEmitter.prototype.removeListener.apply(my, arguments);
    if (my.listeners(eventName).length === 0) {
      Event.removeProxiedEvent(my.name, '', eventName);
    }
  }

};
util.inherits(Robot, EventEmitter);
var proto = Robot.prototype;

// Emulate the real robot.toJSON
proto.toJSON = function() {
  var my = this;
  var connections = [];
  var devices = [];
  var i;

  for (i in my.connections) {
    connections.push(my.connections[i]);
  }

  for (i in my.devices) {
    devices.push(my.devices[i].toJSON());
  }

  return {
    name: my.name,
    connections: connections,
    devices: devices,
    commands: Object.keys(my.commands)
  };
};

proto.halt = NOP;
