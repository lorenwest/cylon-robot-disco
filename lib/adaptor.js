/*
 * cylon-robot-disco adapor
 *
 * Copyright (c) 2014-2015 Loren West
 * Licensed under the MIT license.
*/

"use strict";

var Cylon = require('cylon');
var logger = Cylon.Logger;
var NOP = function(){};
var Discover = require('node-discover');
var clone = require('clone');
var extend = require('deep-extend');
var RobotProxy = require('./proxy/robot');

/**
 * Connect with the underlying Robot Disco
 *
 * @constructor {Function}
 * @param opts - {Object} Constructor options
 * @param opts.port {Integer} Discovery port - default 12345
 * @param opts.secret {String} Shared secret among all disco members - default: null
 */
var RobotDisco = module.exports = function RobotDisco(opts) {
  var my = this;
  opts = opts || {};
  RobotDisco.__super__.constructor.apply(my, arguments);
  opts.port = opts.port || 12345;
  opts.secret = opts.secret || null;
  my.opts = opts;
  if (my.details && my.details.secret) {
    my.details.secret = '*****';
  }
};
Cylon.Utils.subclass(RobotDisco, Cylon.Adaptor);
var proto = RobotDisco.prototype;

// This is run once per robot.start()
proto.connect = function(callback) {
  var my = this;
  logger.info("Joining the robot-disco.");

  // Add events to Cylon
  Cylon.events = Cylon.events || [];
  Cylon.events.push('robotArrived', 'robotLeft');

  // Start up the discovery mechanism
  var discoOpts = {
    port: my.opts.port,
    key: my.opts.secret
  };
  my.disco = new Discover(discoOpts, function(err) {
    if (err) {
      logger.error('Error connecting with robot discovery');
      return callback(err);
    }

    // Advertise my capabilities
    my.advertise();
    my.intervalTimer = setInterval(function(){my.advertise()}, 1000);

    // Re-connect whenever someone leaves or joins
    my.disco.on('added', function(newNode) {
      var robots = newNode.advertisement && newNode.advertisement.robots;
      if (robots) {
        for (var robotName in robots) {
          logger.info('Remote robot ' + robotName + ' joined robot-disco');
        }
        my.connectTheBots();
      }
    });
    my.disco.on('removed', function(oldNode) {
      var robots = oldNode.advertisement && oldNode.advertisement.robots;
      if (robots) {
        for (var robotName in robots) {
          logger.info('Remote robot ' + robotName + ' left robot-disco');
        }
        my.connectTheBots();
      }
    });

    // Done connecting
    callback(null);

  });

};

proto.disconnect = function(callback) {
  var my = this;
  if (my.disco) {
    my.disco.removeAllListeners();
    my.disconnectTheBots();
    my.disco = null;
  }
  if (my.intervalTimer) {
    clearInterval(my.intervalTimer);
    my.intervalTimer = null;
  }
  callback();
};

// Advertise my capabilities
proto.advertise = function() {
  var my = this;
  var api = Cylon.api_instance;
  if (!api) {return;}

  // Take out a full page ad
  var fullPageAd = {
    port: api.port,
    protocol: api.ssl ? 'https' : 'http',
    robots: {}
  };

  // Only advertise local robots
  for (var robotName in Cylon.robots) {
    var robot = Cylon.robots[robotName];
    if (!robot.isRemote) {
      fullPageAd.robots[robot.name] = robot.toJSON();
    }
  };

  // Place the ad.  This gets sent every second in the 'hello' packet.
  my.disco.advertise(fullPageAd);
};

// Connect remote robots to interact as local robots
proto.connectTheBots = function() {
  var my = this;
  my.disconnectTheBots();
  my.disco.eachNode(function(node) {
    if (node.advertisement && node.advertisement.robots) {
      var robots = node.advertisement.robots;
      for (var name in robots) {
        var robot = robots[name];
        Cylon.robots[robot.name] = new RobotProxy(node, robot);
      }
    }
  });
};

// Disconnect all remote robots
proto.disconnectTheBots = function() {
  var my = this;
  for (var robotName in Cylon.robots) {
    if (Cylon.robots[robotName].isRemote) {
      delete Cylon.robots[robotName];
    }
  }
};

