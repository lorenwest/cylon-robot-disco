/*
 * proxy/command.js - Local proxy for a remote command
 *
 * Copyright (c) 2014-2015 Loren West
 * Licensed under the MIT license.
 */
var request = require('request');
var Promise = require('bluebird');

// Maybe one day this will be a real class
var Command = module.exports = function Command() {};

// Make a proxy to the actual robot for each command
// This returns a hash of command names to implementations
Command.proxyCommands = function(discoNode, robotName, deviceName, commands) {
  var my = this;
  var proxiedCommands = {};
  commands.forEach(function(commandName) {
    proxiedCommands[commandName] = function() {
      var args = Array.prototype.slice.call(arguments);
      return new Promise(function(resolve, reject) {

        // Build the url to the command
        var mcp = discoNode.advertisement;
        url = mcp.protocol + '://' + discoNode.address + ':' + mcp.port + '/api';
        url += robotName ? '/robots/' + encodeURIComponent(robotName) : '';
        url += deviceName ? '/devices/' + encodeURIComponent(deviceName) : '';
        url += '/commands/' + encodeURIComponent(commandName);
        for (var i = 0; i < args.length; i++) {
          url += (i === 0 ? '?' : '&');
          url += '' + i + '=' + encodeURIComponent(args[i]);
        }

        request.get(url, function(error, response, body) {
          if (error) {return reject(error);}
          try {
            body = JSON.parse(body);
          }
          catch (e) {
            return reject('JSON parse error: ' + body);
          }
          resolve(body.result);
        });
      });
    }
  });
  return proxiedCommands;
};
